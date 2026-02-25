from fastapi import FastAPI
import sqlite3
import h3

app = FastAPI(title="KazWorkForce Allocation System")

def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/")
def root():
    return {"message": "KazWorkForce API running"}

@app.post("/users")
def create_user(username: str, email: str, role: str):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO users (username, email, role) VALUES (?, ?, ?)",
        (username, email, role)
    )

    conn.commit()
    user_id = cursor.lastrowid
    conn.close()

    return {"id": user_id, "username": username, "role": role}

@app.post("/jobs")
def create_job(
    title: str,
    description: str,
    latitude: float,
    longitude: float,
    employer_id: int,
    requester_id: int
):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT role FROM users WHERE id = ?", (requester_id,))
    user = cursor.fetchone()

    if not user or user["role"] != "employer":
        conn.close()
        return {"error": "Only employers can create jobs"}

    h3_index = h3.geo_to_h3(latitude, longitude, 7)

    cursor.execute("""
        INSERT INTO jobs (title, description, latitude, longitude, h3_index, employer_id)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (title, description, latitude, longitude, h3_index, employer_id))

    conn.commit()
    job_id = cursor.lastrowid

    cursor.execute("""
        INSERT INTO audit_log (table_name, action, record_id, performed_by)
        VALUES ('jobs', 'create', ?, ?)
    """, (job_id, requester_id))

    conn.commit()
    conn.close()

    return {"job_id": job_id, "h3_index": h3_index}

@app.get("/jobs")
def get_jobs():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM jobs")
    jobs = cursor.fetchall()
    conn.close()

    return [dict(job) for job in jobs]

@app.post("/apply")
def apply_to_job(user_id: int, job_id: int):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO applications (user_id, job_id)
        VALUES (?, ?)
    """, (user_id, job_id))

    cursor.execute("""
        INSERT INTO job_applications_summary (job_id, total_applications, last_applied_at)
        VALUES (?, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(job_id)
        DO UPDATE SET
            total_applications = total_applications + 1,
            last_applied_at = CURRENT_TIMESTAMP
    """, (job_id,))

    cursor.execute("""
        INSERT INTO audit_log (table_name, action, record_id, performed_by)
        VALUES ('applications', 'create', ?, ?)
    """, (job_id, user_id))

    conn.commit()
    conn.close()

    print(f"EVENT: Worker {user_id} applied to job {job_id}")

    return {"message": "Application submitted"}

@app.get("/jobs/by-h3/{h3_index}")
def get_jobs_by_h3(h3_index: str):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM jobs WHERE h3_index = ?", (h3_index,))
    jobs = cursor.fetchall()
    conn.close()

    return [dict(job) for job in jobs]

@app.get("/audit")
def get_audit_log():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM audit_log")
    logs = cursor.fetchall()
    conn.close()

    return [dict(log) for log in logs]
