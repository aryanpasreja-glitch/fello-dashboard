-- Create this function in your Supabase SQL Editor
-- This function will execute the dashboard query and return the latest data

-- Drop the old function first if it exists with different return types
DROP FUNCTION IF EXISTS refresh_dashboard();

CREATE OR REPLACE FUNCTION refresh_dashboard()
RETURNS TABLE (
    total_count bigint,
    tier1_count bigint,
    tier1_percentage numeric,
    tier2_count bigint,
    tier2_percentage numeric,
    tier3_count bigint,
    tier3_percentage numeric,
    icp_positive bigint,
    icp_neutral bigint,
    icp_negative bigint,
    created_at timestamp with time zone
) 
LANGUAGE plpgsql
AS $$
#variable_conflict use_column
BEGIN
    -- Perform the insert
    INSERT INTO mad_dashboard (
        total_count, 
        tier1_count, tier1_percentage,
        tier2_count, tier2_percentage,
        tier3_count, tier3_percentage,
        icp_positive, icp_neutral, icp_negative
    )
    WITH total_agents AS (
        SELECT COUNT(*)::bigint AS cnt FROM new_unified_agents
    ),
    tier1 AS (
        SELECT supabase_uuid
        FROM new_unified_agents
        WHERE 
            team_size IS NOT NULL
            AND (google_rating IS NOT NULL OR zillow_rating IS NOT NULL)
            AND (tech_stack IS NOT NULL AND tech_stack::text <> '{}')
            AND (
                tech_stack::text ILIKE '%crm%' OR tech_stack::text ILIKE '%CRM%'
            )
            AND (
                (social_links->>'facebook') IS NOT NULL
                OR (social_links->>'linkedin') IS NOT NULL
                OR (social_links->>'instagram') IS NOT NULL
            )
            AND (
                total_sales IS NOT NULL 
                OR (sales_last_12_months IS NOT NULL AND array_length(sales_last_12_months, 1) > 0)
            )
            AND website IS NOT NULL
    ),
    tier2 AS (
        SELECT supabase_uuid
        FROM new_unified_agents
        WHERE supabase_uuid NOT IN (SELECT supabase_uuid FROM tier1)
          AND (first_name IS NOT NULL OR last_name IS NOT NULL)
          AND (
              (email IS NOT NULL AND array_length(email, 1) > 0)
              OR (phone IS NOT NULL AND array_length(phone, 1) > 0)
          )
          AND (
              (full_address IS NOT NULL AND array_length(full_address, 1) > 0)
              OR city IS NOT NULL
              OR state IS NOT NULL
              OR zip_code IS NOT NULL
          )
          AND (
              website IS NOT NULL
              OR social_links IS NOT NULL
              OR photo_url IS NOT NULL
          )
    ),
    tier3 AS (
        SELECT supabase_uuid
        FROM new_unified_agents
        WHERE supabase_uuid NOT IN (SELECT supabase_uuid FROM tier1)
          AND supabase_uuid NOT IN (SELECT supabase_uuid FROM tier2)
          AND (
              (first_name IS NOT NULL OR last_name IS NOT NULL)
              OR (email IS NOT NULL AND array_length(email, 1) > 0)
              OR (phone IS NOT NULL AND array_length(phone, 1) > 0)
          )
    ),
    icp AS (
        SELECT 
            supabase_uuid,
            CASE 
                WHEN (total_sales >= 12 OR (sales_last_12_months IS NOT NULL AND cardinality(sales_last_12_months) >= 12))
                     AND (google_rating >= 4.5 OR zillow_rating >= 4.5)
                     AND (tech_stack::text ILIKE '%crm%')
                     THEN 'positive'
                WHEN (total_sales BETWEEN 6 AND 12 OR (sales_last_12_months IS NOT NULL AND cardinality(sales_last_12_months) BETWEEN 6 AND 12))
                     AND (google_rating >= 4.0 OR zillow_rating >= 4.0)
                     THEN 'neutral'
                ELSE 'negative'
            END AS icp_status
        FROM new_unified_agents
    ),
    summary AS (
        SELECT
            (SELECT cnt FROM total_agents)::bigint AS total_count,
            (SELECT COUNT(*) FROM tier1)::bigint AS tier1_count,
            ROUND(((SELECT COUNT(*) FROM tier1)::numeric / (SELECT cnt FROM total_agents)::numeric) * 100, 2) AS tier1_percentage,
            (SELECT COUNT(*) FROM tier2)::bigint AS tier2_count,
            ROUND(((SELECT COUNT(*) FROM tier2)::numeric / (SELECT cnt FROM total_agents)::numeric) * 100, 2) AS tier2_percentage,
            (SELECT COUNT(*) FROM tier3)::bigint AS tier3_count,
            ROUND(((SELECT COUNT(*) FROM tier3)::numeric / (SELECT cnt FROM total_agents)::numeric) * 100, 2) AS tier3_percentage,
            (SELECT COUNT(*) FROM icp WHERE icp_status = 'positive')::bigint AS icp_positive,
            (SELECT COUNT(*) FROM icp WHERE icp_status = 'neutral')::bigint AS icp_neutral,
            (SELECT COUNT(*) FROM icp WHERE icp_status = 'negative')::bigint AS icp_negative
    )
    SELECT * FROM summary;

    -- Return the just-inserted row
    RETURN QUERY 
    SELECT 
        md.total_count,
        md.tier1_count,
        md.tier1_percentage,
        md.tier2_count,
        md.tier2_percentage,
        md.tier3_count,
        md.tier3_percentage,
        md.icp_positive,
        md.icp_neutral,
        md.icp_negative,
        md.created_at
    FROM mad_dashboard md
    ORDER BY md.created_at DESC
    LIMIT 1;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION refresh_dashboard() TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_dashboard() TO anon;

