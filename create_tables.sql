CREATE TYPE OS AS ENUM( 'Windows', 'Linux', 'MacOS');

CREATE TABLE IF NOT EXISTS developer_infos (
	id SERIAL PRIMARY KEY,
	"developerSince" DATE NOT NULL,
	"preferredOS" OS NOT NULL
);


CREATE TABLE IF NOT EXISTS developers (
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	"email" VARCHAR(50) UNIQUE NOT NULL
);


	ALTER TABLE IF EXISTS developer_infos 
	ADD "developers_id" INTEGER UNIQUE;
	
	ALTER TABLE IF EXISTS developer_infos
	ADD FOREIGN KEY ("developers_id") REFERENCES developers (id);

CREATE TABLE IF NOT EXISTS projects (
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(50) NOT NULL,
	"description" TEXT NOT NULL,
	"estimatedTime" VARCHAR(20) NOT NULL,
	"repository" VARCHAR(120) NOT NULL,
	"startDate" DATE NOT NULL,
	"endDate" DATE
)

INSERT INTO projects ("name", "description", "estimatedTime", "repository", "startDate", "developers_id")
VALUES ('Teste de Projeto 1', 'Feito para testar a Query', '4 dias', 'urldela.com.br', '05/10/2023', 1 );

CREATE TABLE IF NOT EXISTS technologies (
	id SERIAL PRIMARY KEY,
	"name" VARCHAR(30) NOT NULL
);

INSERT INTO technologies (name)
VALUES ('JavaScript'),('Python'),('React'),('Express.js'),('HTML'),('CSS'),('Django'),('PostgreSQL'),('MongoDB');


CREATE TABLE IF NOT EXISTS project_technologies (
	id SERIAL PRIMARY KEY,
	"addedIn" DATE NOT NULL
)

CREATE TABLE IF NOT EXISTS project_technologies (
	id SERIAL PRIMARY KEY,
	"addedIn" DATE NOT NULL,
	"technology_id" INTEGER NOT NULL,
	"project_id" INTEGER NOT NULL,
FOREIGN KEY (technology_id) REFERENCES technologies(id),
FOREIGN KEY (project_id) REFERENCES projects(id)
);

INSERT INTO project_technologies ("addedIn", technology_id, project_id)
VALUES ('2023-02-11', 1, 6),('2023-02-11', 3, 6),('2023-02-11', 8, 6);



SELECT *
FROM developer_infos;

SELECT *
FROM developers;

SELECT *
FROM projects;

SELECT *
FROM technologies;

SELECT *
FROM project_technologies;
 
SELECT * 
FROM project_technologies;

	SELECT 
	    d.*,
	    di."developerSince",
	    di."preferredOS",
	    di."developers_id" 
	FROM developers AS d
	LEFT JOIN developer_infos di
	    ON d.id = di.developers_id;
	   
	SELECT 
		p.*,
		pt.technology_id "technologyID",
		t.name "technologyName" 
	FROM projects p 
	LEFT JOIN
		project_technologies pt 
		ON p.id = pt.project_id
	LEFT JOIN
		technologies t 
		ON pt.technology_id = t.id;
	   
	SELECT 
		d.id "developerID",
		d."name" "developerName",
		d.email "developerEmail",
		di.id "developerInfoID",
		di."developerSince" "developerInfoDeveloperSince",
		di."preferredOS" "developerInfoPreferredOS",
		p.id "projectID",
		p."name" "projectName",
		p.description "projectDescription",
		p."estimatedTime" "projectEstimatedTime",
		p.repository "projectRepository",
		p."startDate" "projectStartDate",
		p."endDate" "projectEndDate",
		pt.technology_id "technologyID",
		t.name "technologyName" 
	FROM developers d 
	FULL OUTER JOIN
		projects p ON p.developers_id = d.id 
	FULL OUTER JOIN 
		developer_infos di ON d.id = di.developers_id 
	FULL OUTER JOIN
		project_technologies pt ON p.id = pt.project_id
	FULL OUTER JOIN
		technologies t ON pt.technology_id = t.id
	WHERE d.id = 5;


