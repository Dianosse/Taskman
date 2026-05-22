-- USERS

INSERT INTO public.users (id, email, password_hash, username, bio, city) VALUES (1, 'toto@exemple.com', '$argon2id$v=19$m=65536,t=3,p=4$ROluqfjGMY2WXy5Z5CjhpA$Ny6zuhFeNKf5OUN/W+gVGoCCksVmNgHOC/vxF4gefB0', 'toto', 'Je suis TOTO', 'Paris');
INSERT INTO public.users (id, email, password_hash, username, bio, city) VALUES (2, 'tata@exemple.com', '$argon2id$v=19$m=65536,t=3,p=4$mXf++SYnkaD9RXE8Hqw0IQ$dwEYb+8qk+3d0pe5YC1bJP3ZNkkrKGlGfDL2Sgxfn8E', 'tata', 'Je suis TATA', 'Marseille');
INSERT INTO public.users (id, email, password_hash, username, bio, city) VALUES (3, 'elias@example.com', '$argon2id$v=19$m=65536,t=3,p=4$1JMLMvjDaAOL2CrCUuBLug$VEwnB2Ae4NTAZ1tS78EaIGJfEFNCHD65VCqPlegi5ak', 'Elias', 'Je suis elias....', 'Monaco');
INSERT INTO public.users (id, email, password_hash, username, bio, city) VALUES (4, 'victor@example.com', '$argon2id$v=19$m=65536,t=3,p=4$AMgTmfXQLcWLi3QgzNv1Hw$brjrfvWFA8aPWzpPrpvICxCdQP8jColW+zysHUkmVTQ', 'Victor', 'Ahahahaaha j''adore rire', 'Andorre la vieille');
INSERT INTO public.users (id, email, password_hash, username, bio, city) VALUES (5, 'alexandre@example.com', '$argon2id$v=19$m=65536,t=3,p=4$ZuGx53cwuCFUkTQpNMJHvw$5c9vvAho6FIXXXUxqDuLsLdLYTdQOMFCoN1TuS6Q/80', 'Alexandre', 'J''escalade le monde', 'Bordeaux');
INSERT INTO public.users (id, email, password_hash, username, bio, city) VALUES (6, 'yann@example.com', '$argon2id$v=19$m=65536,t=3,p=4$nNLZdITpuhwfpvkq31aPSw$WzchHVe4Mwk74gu3AfSucX/y5LauWvhXLpUL4ydxyNY', 'Yann', 'Hein ?', 'Le Havre');
INSERT INTO public.users (id, email, password_hash, username, bio, city) VALUES (7, 'racime@example.com', '$argon2id$v=19$m=65536,t=3,p=4$doWq9BIHRcWOT4aBYUOk1g$DMMlKIGGGTEuK4uOeG46riUObiGquxddZZdSbePT1Oc', 'Racime', 'Qui LOL ?', 'Poissy');
INSERT INTO public.users (id, email, password_hash, username, bio, city) VALUES (8, 'fadidi@example.com', '$argon2id$v=19$m=65536,t=3,p=4$RTSj0adXDinfFAdA8CY7nw$64uneiicytqw43VIdNqHDQNZk8QthlHmILkojIvhKRw', 'Fadidi', 'Je souhaite acheter vos produits informatiques', 'Paris');
INSERT INTO public.users (id, email, password_hash, username, bio, city) VALUES (9, 'alexandre.p@example.com', '$argon2id$v=19$m=65536,t=3,p=4$Nre2c/YqdadglM1omNRHJw$BXUD3/ixrG0dhWpwXrQuJWxJ5Ksut+5usUvkhz8k+o8', 'Alexandre', 'J''ai des trains pas cher si vous voulez', 'Paris');
INSERT INTO public.users (id, email, password_hash, username, bio, city) VALUES (10, 'abi@example.com', '$argon2id$v=19$m=65536,t=3,p=4$xP5qeALfFd4DaKQd+QQMjQ$yK9GndfyuevbOIZz9tDeT9SCMs2bbuZ89SKONscxh04', 'Abinash', 'Hmmm', 'Deauville');
INSERT INTO public.users (id, email, password_hash, username, bio, city) VALUES (11, 'phi@example.com', '$argon2id$v=19$m=65536,t=3,p=4$dHshEoBwPvt90ZEr1q+qEA$ulVfFEpSFUk3VPryJDLneCIqfwx5Tuzvud4LEwKjnig', 'Philippe', 'Je souris à la vie', 'Sarcelle');


-- ANNONCES

INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (1, 'Faire vos courses', 'Je fais vos courses à votre place. Tarif discutable.', 'OFFER', 'Paris', 'Aide', 'Mercredi soir', 'HOURLY', 20, 'REMOTE', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 1);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (2, 'Aide au déménagement', 'Je cherche quelqu’un pour m’aider à porter des cartons.', 'REQUEST', 'Paris', 'Aide', 'Samedi matin', 'FIXED', 40, 'AT_CUSTOMER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 1);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (3, 'Cours débutant HTML CSS', 'Je propose une aide pour apprendre les bases du HTML et CSS.', 'OFFER', 'Paris', 'Informatique', 'Mercredi soir', 'HOURLY', 20, 'REMOTE', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 1);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (4, 'Garde enfant week-end', 'Je peux garder vos enfants le samedi ou dimanche.', 'OFFER', 'Marseille', 'Baby-sitting', 'Week-end', 'HOURLY', 15, 'AT_CUSTOMER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 2);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (5, 'Recherche cours de cuisine', 'Je cherche quelqu’un pour apprendre à cuisiner des plats simples.', 'REQUEST', 'Marseille', 'Cuisine', 'Vendredi soir', 'HOURLY', 18, 'AT_PROVIDER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 2);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (6, 'Création flyer simple', 'Je réalise des flyers simples pour événements ou associations.', 'OFFER', 'Marseille', 'Design', 'Semaine', 'FIXED', 35, 'REMOTE', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 2);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (7, 'Cours de piano débutant', 'Cours de piano pour débutants, sans pression.', 'OFFER', 'Monaco', 'Cours', 'Mardi soir', 'HOURLY', 30, 'AT_PROVIDER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 3);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (8, 'Aide installation ordinateur', 'Je peux vous aider à configurer un ordinateur ou installer des logiciels.', 'OFFER', 'Monaco', 'Informatique', 'Samedi', 'FIXED', 45, 'AT_CUSTOMER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 3);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (9, 'Recherche baby-sitter', 'Je cherche une personne sérieuse pour garder deux enfants.', 'REQUEST', 'Monaco', 'Baby-sitting', 'Jeudi soir', 'HOURLY', 16, 'AT_CUSTOMER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 3);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (10, 'Réparation petite étagère', 'Je peux réparer ou fixer une petite étagère.', 'OFFER', 'Andorre la vieille', 'Bricolage', 'Dimanche', 'FIXED', 25, 'AT_CUSTOMER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 4);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (11, 'Cours de dessin', 'Je propose des cours de dessin pour débutants.', 'OFFER', 'Andorre la vieille', 'Cours', 'Mercredi après-midi', 'HOURLY', 18, 'AT_PROVIDER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 4);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (12, 'Recherche aide informatique', 'Je cherche quelqu’un pour m’aider à comprendre mon ordinateur.', 'REQUEST', 'Andorre la vieille', 'Informatique', 'Lundi soir', 'HOURLY', 20, 'AT_CUSTOMER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 4);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (13, 'Initiation escalade', 'Je propose une initiation à l’escalade pour débutants.', 'OFFER', 'Bordeaux', 'Cours', 'Samedi après-midi', 'HOURLY', 25, 'AT_PROVIDER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 5);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (14, 'Montage meuble', 'Je peux monter vos meubles rapidement.', 'OFFER', 'Bordeaux', 'Bricolage', 'Week-end', 'FIXED', 40, 'AT_CUSTOMER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 5);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (15, 'Recherche logo association', 'Je cherche quelqu’un pour faire un logo simple pour une association.', 'REQUEST', 'Bordeaux', 'Design', 'Semaine', 'FIXED', 60, 'REMOTE', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 5);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (16, 'Aide devoirs collège', 'Je peux aider pour les devoirs niveau collège.', 'OFFER', 'Le Havre', 'Cours', 'Mercredi soir', 'HOURLY', 17, 'REMOTE', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 6);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (17, 'Cuisine repas simple', 'Je peux préparer un repas simple pour une petite occasion.', 'OFFER', 'Le Havre', 'Cuisine', 'Vendredi', 'FIXED', 35, 'AT_PROVIDER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 6);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (18, 'Recherche aide bricolage', 'J’ai besoin d’aide pour percer et fixer un meuble.', 'REQUEST', 'Le Havre', 'Bricolage', 'Samedi matin', 'FIXED', 30, 'AT_CUSTOMER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 6);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (19, 'Création bannière web', 'Je crée des bannières simples pour sites ou réseaux sociaux.', 'OFFER', 'Poissy', 'Design', 'Soirée', 'FIXED', 45, 'REMOTE', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 7);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (20, 'Cours JavaScript débutant', 'Je propose des cours pour comprendre les bases de JavaScript.', 'OFFER', 'Poissy', 'Informatique', 'Dimanche soir', 'HOURLY', 22, 'REMOTE', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 7);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (21, 'Recherche aide aux courses', 'Je cherche quelqu’un pour m’aider à faire mes courses.', 'REQUEST', 'Poissy', 'Aide', 'Mardi matin', 'HOURLY', 10, 'AT_CUSTOMER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 7);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (22, 'Conseil achat PC', 'Je peux conseiller pour choisir un ordinateur selon votre budget.', 'OFFER', 'Paris', 'Informatique', 'Semaine', 'FIXED', 25, 'REMOTE', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 8);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (23, 'Recherche cours de maths', 'Je cherche un professeur pour progresser en mathématiques.', 'REQUEST', 'Paris', 'Cours', 'Lundi soir', 'HOURLY', 20, 'REMOTE', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 8);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (24, 'Aide installation box internet', 'Je peux aider à installer une box internet et connecter les appareils.', 'OFFER', 'Paris', 'Informatique', 'Samedi', 'FIXED', 30, 'AT_CUSTOMER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 8);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (25, 'Réservation billets train', 'Je peux aider à trouver des billets de train moins chers.', 'OFFER', 'Paris', 'Aide', 'Tous les jours', 'FREE', 0, 'REMOTE', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 9);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (26, 'Création carte de visite', 'Je réalise une carte de visite simple et propre.', 'OFFER', 'Paris', 'Design', 'Soirée', 'FIXED', 30, 'REMOTE', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 9);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (27, 'Recherche baby-sitting ponctuel', 'Je cherche une garde ponctuelle pour un enfant.', 'REQUEST', 'Paris', 'Baby-sitting', 'Samedi soir', 'HOURLY', 14, 'AT_CUSTOMER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 9);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (28, 'Cours Python débutant', 'Je propose des cours de Python pour débutants.', 'OFFER', 'Deauville', 'Informatique', 'Dimanche', 'HOURLY', 24, 'REMOTE', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 10);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (29, 'Préparation repas indien', 'Je peux préparer un repas indien maison.', 'OFFER', 'Deauville', 'Cuisine', 'Week-end', 'FIXED', 50, 'AT_PROVIDER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 10);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (30, 'Recherche aide design CV', 'Je cherche quelqu’un pour améliorer la mise en page de mon CV.', 'REQUEST', 'Deauville', 'Design', 'Semaine', 'FIXED', 35, 'REMOTE', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 10);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (31, 'Aide administrative', 'Je peux aider à remplir des documents administratifs simples.', 'OFFER', 'Sarcelle', 'Aide', 'Lundi matin', 'HOURLY', 15, 'REMOTE', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 11);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (32, 'Cours de français', 'Je propose des cours de français niveau collège.', 'OFFER', 'Sarcelle', 'Cours', 'Mercredi', 'HOURLY', 19, 'AT_PROVIDER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 11);
INSERT INTO public.annonces (id, titre, description, type, city, category, availability, tarif_type, tarif, modality, status, published_at, id_creator) VALUES (33, 'Recherche réparation chaise', 'Je cherche quelqu’un pour réparer une chaise cassée.', 'REQUEST', 'Sarcelle', 'Bricolage', 'Dimanche matin', 'FIXED', 20, 'AT_CUSTOMER', 'PUBLISHED', '2026-05-21 12:49:12.199525 +00:00', 11);


-- CONVERSATIONS

INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (1, 1, 1, 2);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (2, 2, 1, 5);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (3, 3, 1, 8);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (4, 4, 2, 9);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (5, 5, 2, 10);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (6, 6, 2, 7);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (7, 7, 3, 11);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (8, 8, 3, 8);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (9, 9, 2, 3);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (10, 10, 4, 6);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (11, 11, 4, 10);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (12, 12, 4, 8);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (13, 13, 5, 6);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (14, 14, 5, 11);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (15, 15, 5, 9);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (16, 20, 7, 10);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (17, 22, 8, 10);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (18, 25, 3, 9);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (19, 28, 8, 10);
INSERT INTO public.conversations (id, id_annonce, id_user1, id_user2) VALUES (20, 31, 1, 11);


-- MESSAGES

INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (1, 1, 2, 'Bonjour, vous êtes disponible demain soir ?', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (2, 1, 1, 'Oui, je suis disponible après 18h.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (3, 2, 5, 'Bonjour, il y a beaucoup de cartons ?', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (4, 2, 1, 'Une quinzaine environ, rien de très lourd.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (5, 3, 8, 'Salut, je veux apprendre les bases pour modifier une page web.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (6, 3, 1, 'Pas de souci, on peut commencer par HTML puis CSS.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (7, 4, 9, 'Bonjour, êtes-vous disponible samedi soir ?', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (8, 4, 2, 'Oui, à partir de 19h.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (9, 5, 10, 'Je peux vous apprendre quelques recettes simples.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (10, 5, 2, 'Super, je cherche surtout des plats rapides.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (11, 6, 7, 'Bonjour, vous pouvez faire un flyer pour un événement sportif ?', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (12, 6, 2, 'Oui, envoyez-moi les infos à mettre dessus.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (13, 7, 11, 'Bonjour, faut-il déjà avoir un piano ?', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (14, 7, 3, 'Non, je peux faire une première séance chez moi.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (15, 8, 8, 'Bonjour, vous installez aussi les imprimantes ?', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (16, 8, 3, 'Oui, si vous avez les câbles ou le Wi-Fi.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (17, 9, 2, 'Bonjour, je suis disponible jeudi soir.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (18, 9, 3, 'Merci, ce serait pour 3 heures environ.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (19, 10, 6, 'Bonjour, l’étagère est déjà achetée ?', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (20, 10, 4, 'Oui, il faut seulement la fixer.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (21, 11, 10, 'Bonjour, les cours sont adaptés aux débutants complets ?', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (22, 11, 4, 'Oui, aucun niveau requis.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (23, 12, 8, 'Je peux vous aider à distance ou sur place.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (24, 12, 4, 'Sur place ce serait mieux.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (25, 13, 6, 'Salut, il faut du matériel ?', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (26, 13, 5, 'Non, le matériel peut être loué sur place.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (27, 14, 11, 'Bonjour, vous pouvez monter une armoire ?', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (28, 14, 5, 'Oui, il faut prévoir environ deux heures.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (29, 15, 9, 'Je peux proposer une maquette simple.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (30, 15, 5, 'Parfait, je vous envoie le nom de l’association.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (31, 16, 10, 'Bonjour, je veux apprendre JavaScript pour mon projet.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (32, 16, 7, 'Pas de problème, on peut commencer par les bases.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (33, 17, 10, 'Bonjour, vous pouvez me conseiller pour un PC portable ?', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (34, 17, 8, 'Oui, dites-moi votre budget et votre usage.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (35, 18, 3, 'Bonjour, vous pouvez vraiment trouver des billets moins chers ?', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (36, 18, 9, 'Oui, je peux comparer plusieurs horaires et trajets.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (37, 19, 8, 'Bonjour, je veux apprendre Python pour automatiser des tâches.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (38, 19, 10, 'Très bien, on peut commencer avec les variables et les boucles.', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (39, 20, 1, 'Bonjour, vous pouvez aider pour un dossier administratif ?', '2026-05-21 12:49:33.539067 +00:00');
INSERT INTO public.messages (id, id_conversation, id_user, content, created_at) VALUES (40, 20, 11, 'Oui, si les documents sont prêts.', '2026-05-21 12:49:33.539067 +00:00');


-- FAVORIS

INSERT INTO public.favoris (id_user, id_annonce) VALUES (1, 4);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (1, 14);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (1, 28);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (2, 1);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (2, 19);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (2, 31);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (3, 3);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (3, 29);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (3, 32);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (4, 22);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (4, 16);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (4, 25);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (5, 6);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (5, 24);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (5, 11);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (6, 2);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (6, 21);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (6, 15);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (7, 28);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (7, 23);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (7, 31);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (8, 7);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (8, 18);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (8, 32);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (9, 20);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (9, 17);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (9, 10);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (10, 26);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (10, 8);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (10, 31);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (11, 23);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (11, 30);
INSERT INTO public.favoris (id_user, id_annonce) VALUES (11, 5);
