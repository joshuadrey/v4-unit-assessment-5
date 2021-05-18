INSERT INTO helo_users 
(username, profile_pic, password)
VALUES
($1, $2, $3)
RETURNING *;