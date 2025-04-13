async function handler({ page = 1, search, gender, experience, skills }) {
  const limit = 10;
  const offset = (page - 1) * limit;

  let queryString = `
    SELECT DISTINCT c.*, 
    array_agg(s.name) as skills
    FROM candidates c
    LEFT JOIN candidate_skills cs ON c.id = cs.candidate_id
    LEFT JOIN skills s ON cs.skill_id = s.id
    WHERE 1=1
  `;

  const values = [];
  let paramCount = 1;

  if (search) {
    queryString += ` AND (
      LOWER(c.name) LIKE LOWER($${paramCount}) OR 
      LOWER(c.email) LIKE LOWER($${paramCount}) OR 
      LOWER(c.phone) LIKE LOWER($${paramCount})
    )`;
    values.push(`%${search}%`);
    paramCount++;
  }

  if (gender) {
    queryString += ` AND c.gender = $${paramCount}`;
    values.push(gender);
    paramCount++;
  }

  if (experience) {
    queryString += ` AND c.experience = $${paramCount}`;
    values.push(parseInt(experience));
    paramCount++;
  }

  if (skills?.length) {
    const skillQuery = `
      SELECT candidate_id FROM candidate_skills cs
      JOIN skills s ON cs.skill_id = s.id
      WHERE s.name = ANY($${paramCount})
    `;
    queryString += ` AND c.id IN (${skillQuery})`;
    values.push(skills);
    paramCount++;
  }

  queryString += ` GROUP BY c.id`;
  queryString += ` ORDER BY c.created_at DESC`;
  queryString += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
  values.push(limit, offset);

  const candidates = await sql(queryString, values);

  let countQuery = `
    SELECT COUNT(DISTINCT c.id) 
    FROM candidates c
    WHERE 1=1
  `;

  const countValues = [];
  paramCount = 1;

  if (search) {
    countQuery += ` AND (
      LOWER(c.name) LIKE LOWER($${paramCount}) OR 
      LOWER(c.email) LIKE LOWER($${paramCount}) OR 
      LOWER(c.phone) LIKE LOWER($${paramCount})
    )`;
    countValues.push(`%${search}%`);
    paramCount++;
  }

  if (gender) {
    countQuery += ` AND c.gender = $${paramCount}`;
    countValues.push(gender);
    paramCount++;
  }

  if (experience) {
    countQuery += ` AND c.experience = $${paramCount}`;
    countValues.push(parseInt(experience));
    paramCount++;
  }

  if (skills?.length) {
    countQuery += ` AND c.id IN (
      SELECT candidate_id FROM candidate_skills cs
      JOIN skills s ON cs.skill_id = s.id
      WHERE s.name = ANY($${paramCount})
    )`;
    countValues.push(skills);
  }

  const [{ count }] = await sql(countQuery, countValues);

  return {
    candidates,
    pages: Math.ceil(count / limit),
    currentPage: page,
  };
}