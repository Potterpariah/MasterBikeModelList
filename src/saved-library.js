// Read-only index of the signed-in user's saved/followed items.
// Missing or unpublished targets remain removable without exposing their titles.
export async function readSavedLibrary(env,userId) {
  const limit=500;
  async function list(table) {
    const rows=await env.DB.prepare(`
      SELECT x.entity_type,x.entity_id,x.created_at,
        CASE x.entity_type
          WHEN 'discussion' THEN CASE WHEN d.status='published' THEN d.title END
          WHEN 'event' THEN e.title
          WHEN 'guide' THEN CASE WHEN g.status='published' THEN g.title END
          WHEN 'brand' THEN b.name
          WHEN 'bike' THEN m.name
          WHEN 'user' THEN CASE WHEN u.status='active' THEN COALESCE(NULLIF(u.display_name,''),u.username) END
          WHEN 'comment' THEN CASE WHEN c.status='published' AND cd.status='published' THEN 'Reply in ' || cd.title END
        END AS title,
        m.brand_id AS bike_brand_id,u.username AS profile_username,c.discussion_id AS comment_discussion_id
      FROM ${table} x
      LEFT JOIN discussions d ON x.entity_type='discussion' AND x.entity_id=d.id
      LEFT JOIN events e ON x.entity_type='event' AND x.entity_id=e.id
      LEFT JOIN guides g ON x.entity_type='guide' AND x.entity_id=g.id
      LEFT JOIN brands b ON x.entity_type='brand' AND x.entity_id=b.id
      LEFT JOIN bike_models m ON x.entity_type='bike' AND x.entity_id=m.id
      LEFT JOIN users u ON x.entity_type='user' AND x.entity_id=u.id
      LEFT JOIN comments c ON x.entity_type='comment' AND x.entity_id=c.id
      LEFT JOIN discussions cd ON cd.id=c.discussion_id
      WHERE x.user_id=? ORDER BY x.created_at DESC,x.entity_type,x.entity_id LIMIT ?
    `).bind(userId,limit).all();
    const count=await env.DB.prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE user_id=?`).bind(userId).first();
    return {total:count.count,items:rows.results.map(row=>{
      const {entity_type:type,entity_id:id,created_at:saved_at,title}=row;
      const routes={discussion:'#discussion/',event:'#event/',guide:'#guide/',brand:'#brand/',bike:'#brand/',comment:'#discussion/',user:'/api/users/'};
      const target=type==='bike'?row.bike_brand_id:type==='comment'?row.comment_discussion_id:type==='user'?row.profile_username:id;
      const available=Boolean(title && routes[type] && target);
      return {entity_type:type,entity_id:id,saved_at,title:available?title:'Unavailable item',available,href:available?routes[type]+encodeURIComponent(target):null};
    })};
  }
  const [saves,follows]=await Promise.all([list('saved_items'),list('follows')]);
  return {saves:saves.items,follows:follows.items,totals:{saves:saves.total,follows:follows.total},limit};
}
