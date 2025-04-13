async function handler({ name, phone, email, gender, experience, skills }) {
  if (!name || !phone || !email || !gender || !experience || !skills?.length) {
    return { error: "All fields are required" };
  }

  try {
    const result = await sql.transaction(async (sql) => {
      const [candidate] = await sql(
        "INSERT INTO candidates (name, phone, email, gender, experience) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, phone, email, gender, experience]
      );

      const skillQuery =
        "INSERT INTO skills (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id";
      const skillPromises = skills.map((skill) => sql(skillQuery, [skill]));
      const skillResults = await Promise.all(skillPromises);
      const skillIds = skillResults.map((result) => result[0].id);

      const linkQuery =
        "INSERT INTO candidate_skills (candidate_id, skill_id) VALUES ($1, $2)";
      const linkPromises = skillIds.map((skillId) =>
        sql(linkQuery, [candidate.id, skillId])
      );
      await Promise.all(linkPromises);

      const [result] = await sql(
        "SELECT c.*, array_agg(s.name) as skills FROM candidates c LEFT JOIN candidate_skills cs ON c.id = cs.candidate_id LEFT JOIN skills s ON cs.skill_id = s.id WHERE c.id = $1 GROUP BY c.id",
        [candidate.id]
      );

      return result;
    });

    return result;
  } catch (error) {
    return { error: "Failed to add candidate" };
  }
}