async function handler({ name, phone, email, gender, experience, skills }) {
  if (!name || !phone || !email || !gender || !experience || !skills?.length) {
    return { error: "All fields are required" };
  }

  return await sql.transaction(async (sql) => {
    const [candidate] = await sql`
      INSERT INTO candidates (name, phone, email, gender, experience)
      VALUES (${name}, ${phone}, ${email}, ${gender}, ${experience})
      RETURNING id
    `;

    const skillRows = await sql`
      WITH skill_inserts AS (
        INSERT INTO skills (name)
        SELECT DISTINCT unnest(${skills}::text[])
        ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
      )
      SELECT id FROM skill_inserts
      UNION
      SELECT id FROM skills WHERE name = ANY(${skills}::text[])
    `;

    const skillIds = skillRows.map((row) => row.id);

    await sql`
      INSERT INTO candidate_skills (candidate_id, skill_id)
      SELECT ${candidate.id}, unnest(${skillIds}::int[])
    `;

    return { success: true, candidateId: candidate.id };
  });
}