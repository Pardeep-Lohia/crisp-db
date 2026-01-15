from Database_function.connect_db import get_conn


# =========================================================
# GET ALL PLANS
# =========================================================
def get_all_plans():
    """
    Retrieve all plans.
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
        ORDER BY created_at DESC;
    """
    cur.execute(query)
    plans = cur.fetchall()
    cur.close()
    conn.close()
    return plans


# =========================================================
# CREATE PLAN (SUPER ADMIN ONLY)
# =========================================================
def create_plan(
    name,
    description,
    token_limit,
    price,
    duration_value,
    duration_unit,   # 'month' | 'year'
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
        raise RuntimeError(f"Error creating plan: {e}")
    finally:
        cur.close()
        conn.close()


# =========================================================
# GET PLAN DETAILS
# =========================================================
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


# =========================================================
# UPDATE PLAN
# =========================================================
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
        set_clause = ', '.join(f"{k} = %s" for k in updates)
        values = list(updates.values()) + [plan_id]

        query = f"""
            UPDATE plans
            SET {set_clause}
            WHERE id = %s;
        """
        cur.execute(query, values)
        conn.commit()
        return cur.rowcount > 0
    except Exception as e:
        conn.rollback()
        raise RuntimeError(f"Error updating plan: {e}")
    finally:
        cur.close()
        conn.close()


# =========================================================
# DELETE PLAN (SAFE DELETE)
# =========================================================
def delete_plan(plan_id):
    """
    Delete a plan ONLY if it was never used.
    Otherwise, soft-delete (is_active = false).
    """
    conn = get_conn()
    cur = conn.cursor()
    try:
        # Check usage in company_plans
        usage_query = """
            SELECT COUNT(*)
            FROM company_plans
            WHERE plan_id = %s;
        """
        cur.execute(usage_query, (plan_id,))
        usage_count = cur.fetchone()[0]

        if usage_count > 0:
            # Soft delete
            cur.execute(
                "UPDATE plans SET is_active = false WHERE id = %s;",
                (plan_id,)
            )
            conn.commit()
            return "SOFT_DELETED"

        # Hard delete if never used
        cur.execute("DELETE FROM plans WHERE id = %s;", (plan_id,))
        conn.commit()
        return cur.rowcount > 0
    except Exception as e:
        conn.rollback()
        raise RuntimeError(f"Error deleting plan: {e}")
    finally:
        cur.close()
        conn.close()


# =========================================================
# DEBUG
# =========================================================
if __name__ == "__main__":

    # create_plan(
    #     name="Free",
    #     description="limited scale with premium support",
    #     token_limit=1000,
    #     price=0,  # custom pricing
    #     duration_value=1,
    #     duration_unit="month",
    #     max_agents=1,
    #     human_handover=True,
    #     knowledge_base=True
    # )
    # delete_plan("610b3f58-d441-4c1e-8da5-ac28c451b08f")
    pass