CREATE TABLE Users (
                       id SERIAL,
                       email VARCHAR(50) NOT NULL UNIQUE,
                       password_hash TEXT NOT NULL,
                       username VARCHAR(32) NOT NULL,
                       bio VARCHAR(100) NOT NULL,
                       city VARCHAR(32) NOT NULL,
                       CONSTRAINT PK_User PRIMARY KEY(id)
);

CREATE TABLE Annonces (
                          id SERIAL,
                          titre VARCHAR(50) NOT NULL,
                          description VARCHAR(200),
                          type VARCHAR(7) NOT NULL,
                          city VARCHAR(32),
                          category VARCHAR(32),
                          availability VARCHAR(100),
                          tarif_type VARCHAR(6) NOT NULL,
                          tarif NUMERIC NOT NULL DEFAULT 0,
                          modality VARCHAR(32),
                          status VARCHAR(16),
                          published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                          id_creator INTEGER NOT NULL,
                          CONSTRAINT PK_Annonces PRIMARY KEY (id),
                          CONSTRAINT FK_Annonces_Users FOREIGN KEY (id_creator) REFERENCES Users(id) ON DELETE CASCADE,
                          CONSTRAINT CK_Ann_type CHECK(type = 'OFFER' OR type = 'REQUEST'),
                          CONSTRAINT CK_Ann_tarif CHECK (
                              (tarif_type = 'FREE' AND tarif = 0)
                                  OR
                              ((tarif_type = 'HOURLY' OR tarif_type = 'FIXED') AND tarif >= 0)
                              )
);

CREATE TABLE Conversations (
                               id SERIAL,
                               id_annonce INTEGER NOT NULL,
                               id_user1 INTEGER NOT NULL,
                               id_user2 INTEGER NOT NULL,
                               CONSTRAINT PK_Conversations PRIMARY KEY (id),
                               CONSTRAINT FK_Conversations_Annonces FOREIGN KEY (id_annonce) REFERENCES Annonces(id) ON DELETE CASCADE,
                               CONSTRAINT FK_Conversations_User1 FOREIGN KEY (id_user1) REFERENCES Users (id) ON DELETE CASCADE,
                               CONSTRAINT FK_Conversations_User2 FOREIGN KEY (id_user2) REFERENCES Users (id) ON DELETE CASCADE,
                               CONSTRAINT CK_Con_user_equals CHECK (id_user1 <> id_user2),
                               CONSTRAINT CK_Con_user_order CHECK (id_user1 < id_user2),
                               CONSTRAINT UQ_conv UNIQUE (id_annonce, id_user1, id_user2)
);

CREATE TABLE Messages (
                          id SERIAL,
                          id_conversation INTEGER NOT NULL,
                          id_user INTEGER NOT NULL,
                          content TEXT NOT NULL,
                          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                          CONSTRAINT PK_Messages PRIMARY KEY (id),
                          CONSTRAINT FK_Messages_Conversations FOREIGN KEY (id_conversation) REFERENCES Conversations(id) ON DELETE CASCADE,
                          CONSTRAINT FK_Messages_User FOREIGN KEY (id_user) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Favoris (
                         id_user INTEGER NOT NULL,
                         id_annonce INTEGER NOT NULL,
                         CONSTRAINT PK_Favoris PRIMARY KEY (id_user, id_annonce),
                         CONSTRAINT FK_Favoris_Users FOREIGN KEY (id_user) REFERENCES Users(id) ON DELETE CASCADE,
                         CONSTRAINT FK_Favoris_Annonces FOREIGN KEY (id_annonce) REFERENCES Annonces(id) ON DELETE CASCADE
);