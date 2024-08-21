CREATE TABLE `_users` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `given_name` varchar(50) NOT NULL,
  `family_name` varchar(30) NOT NULL,
  `username` varchar(16) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) NOT NULL,
  `is_bookinator` tinyint(1) NOT NULL,
  `points` int(9) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `_authors` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `given_name` varchar(50) NOT NULL,
  `family_name` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `_books` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `f_id_author` int(10) UNSIGNED NOT NULL,
  `category` varchar(255) NOT NULL,
  `published` date NOT NULL,
  `isbn` char(13) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`),
  INDEX (`f_id_author`),
  FOREIGN KEY (`f_id_author`) REFERENCES `_authors`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `_all_book_categories` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `category` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `_book_categories` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `f_id_book` int(10) UNSIGNED NOT NULL,
  `f_id_category` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX (`f_id_book`),
  INDEX (`f_id_category`),
  FOREIGN KEY (`f_id_book`) REFERENCES `_books`(`id`),
  FOREIGN KEY (`f_id_category`) REFERENCES `_all_book_categories`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `_completed_quizzes` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `f_id_user` int(10) UNSIGNED NOT NULL,
  `f_id_book` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX (`f_id_user`),
  INDEX (`f_id_book`),
  FOREIGN KEY (`f_id_user`) REFERENCES `_users`(`id`),
  FOREIGN KEY (`f_id_book`) REFERENCES `_books`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `_book_ratings` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `rating` int(10) NOT NULL,
  `f_id_book` int(10) UNSIGNED NOT NULL,
  `f_id_user` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX (`f_id_book`),
  INDEX (`f_id_user`),
  FOREIGN KEY (`f_id_book`) REFERENCES `_books`(`id`),
  FOREIGN KEY (`f_id_user`) REFERENCES `_users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `_emails` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `is_primary` tinyint(1) NOT NULL,
  `is_verified` tinyint(1) NOT NULL,
  `f_id_user` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX (`f_id_user`),
  FOREIGN KEY (`f_id_user`) REFERENCES `_users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `_friends` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `f_id_user1` int(10) UNSIGNED NOT NULL,
  `f_id_user2` int(10) UNSIGNED NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  INDEX (`f_id_user1`),
  INDEX (`f_id_user2`),
  FOREIGN KEY (`f_id_user1`) REFERENCES `_users`(`id`),
  FOREIGN KEY (`f_id_user2`) REFERENCES `_users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `_questions` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  `difficulty` int(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `f_id_book` int(10) UNSIGNED NOT NULL,
  `f_id_user` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX (`f_id_book`),
  INDEX (`f_id_user`),
  FOREIGN KEY (`f_id_book`) REFERENCES `_books`(`id`),
  FOREIGN KEY (`f_id_user`) REFERENCES `_users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `_incorrectly_answered_questions` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `f_id_question` int(10) UNSIGNED NOT NULL,
  `f_id_user` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX (`f_id_question`),
  INDEX (`f_id_user`),
  FOREIGN KEY (`f_id_question`) REFERENCES `_questions`(`id`),
  FOREIGN KEY (`f_id_user`) REFERENCES `_users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `_answers` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `f_id_question` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX (`f_id_question`),
  FOREIGN KEY (`f_id_question`) REFERENCES `_questions`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `_question_ratings` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `rating` int(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `f_id_question` int(10) UNSIGNED NOT NULL,
  `f_id_user` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX (`f_id_question`),
  INDEX (`f_id_user`),
  FOREIGN KEY (`f_id_question`) REFERENCES `_questions`(`id`),
  FOREIGN KEY (`f_id_user`) REFERENCES `_users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;