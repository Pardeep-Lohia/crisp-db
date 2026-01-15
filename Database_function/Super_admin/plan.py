from Database_function.connect_db import get_conn

def get_all_plans():
    """
    Retrieve all plans from the database.
    """
    conn = get_conn()
    cur = conn.cursor()
    query = """
    SELECT id, name, description,
           token_limit, price,
           duration_value, duration_unit,
           max_agents, human_handover, knowledge_base,
           is_active, created_at
    FROM plans;
    """
    cur.execute(query)
    plans = cur.fetchall()
    cur.close()
    conn.close()
    return plans


def create_plan(
    name,
    description,
    token_limit,
    price,
    duration_value,
    duration_unit,   # 'month' or 'year'
    max_agents=1,
    human_handover=False,
    knowledge_base=True
):
    """
    Create a new plan.
    """
    conn = get_conn()
    cur = conn.cursor()
    try:
        query = """
        INSERT INTO plans (
            name, description,
            token_limit, price,
            duration_value, duration_unit,
            max_agents, human_handover, knowledge_base
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
        """
        cur.execute(query, (
            name, description,
            token_limit, price,
            duration_value, duration_unit,
            max_agents, human_handover, knowledge_base
        ))
        plan_id = cur.fetchone()[0]
        conn.commit()
        return plan_id
    except Exception as e:
        conn.rollback()
        print(f"Error creating plan: {e}")
        return None
    finally:
        cur.close()
        conn.close()


def get_plan_details(plan_id):
    """
    Retrieve details of a specific plan.
    """
    conn = get_conn()
    cur = conn.cursor()
    query = """
    SELECT id, name, description,
           token_limit, price,
           duration_value, duration_unit,
           max_agents, human_handover, knowledge_base,
           is_active, created_at
    FROM plans
    WHERE id = %s;
    """
    cur.execute(query, (plan_id,))
    plan = cur.fetchone()
    cur.close()
    conn.close()
    return plan


def update_plan(plan_id, **kwargs):
    """
    Update plan details.
    """
    allowed_fields = {
        'name',
        'description',
        'token_limit',
        'price',
        'duration_value',
        'duration_unit',
        'max_agents',
        'human_handover',
        'knowledge_base',
        'is_active'
    }

    updates = {k: v for k, v in kwargs.items() if k in allowed_fields}
    if not updates:
        return False

    conn = get_conn()
    cur = conn.cursor()
    try:
        set_clause = ', '.join(f"{k} = %s" for k in updates.keys())
        values = list(updates.values()) + [plan_id]
        query = f"UPDATE plans SET {set_clause} WHERE id = %s;"
        cur.execute(query, values)
        conn.commit()
        return cur.rowcount > 0
    except Exception as e:
        conn.rollback()
        print(f"Error updating plan: {e}")
        return False
    finally:
        cur.close()
        conn.close()


def delete_plan(plan_id):
    """
    Delete a plan only if no company is using it.
    """
    conn = get_conn()
    cur = conn.cursor()
    try:
        check_query = "SELECT COUNT(*) FROM companies WHERE plan_id = %s;"
        cur.execute(check_query, (plan_id,))
        count = cur.fetchone()[0]

        if count > 0:
            return False

        delete_query = "DELETE FROM plans WHERE id = %s;"
        cur.execute(delete_query, (plan_id,))
        conn.commit()
        return cur.rowcount > 0
    except Exception as e:
        conn.rollback()
        print(f"Error deleting plan: {e}")
        return False
    finally:
        cur.close()
        conn.close()

# Database_function.Super_admin.plan
if __name__ == "__main__":
    print(get_all_plans())