-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 18, 2026 at 04:40 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `android_ipos`
--

-- --------------------------------------------------------

--
-- Table structure for table `meja`
--

CREATE TABLE `meja` (
  `id` int(50) NOT NULL,
  `no_meja` int(50) NOT NULL,
  `status` enum('kosong','ditempati','dipesan','dibersihkan') NOT NULL,
  `update_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `meja`
--

INSERT INTO `meja` (`id`, `no_meja`, `status`, `update_at`) VALUES
(1, 1, 'kosong', '2026-01-18 14:51:30'),
(2, 2, 'ditempati', '2026-01-18 14:56:16'),
(3, 3, 'dibersihkan', '2026-01-18 14:56:24'),
(5, 4, 'dipesan', '2026-01-18 14:56:28');

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` int(50) NOT NULL,
  `nama` varchar(250) NOT NULL,
  `deskripsi` text NOT NULL,
  `foto` varchar(250) NOT NULL,
  `harga` decimal(15,2) NOT NULL,
  `kategori` enum('makanan','minuman','dessert') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `nama`, `deskripsi`, `foto`, `harga`, `kategori`) VALUES
(1, 'Steak dangling sapi ', 'irisan daging sapi berkualitas yang dimasak dengan cara dipanggang, digoreng, atau dibakar, menghasilkan tekstur empuk dan rasa gurih kaya protein, biasanya disajikan dengan saus, kentang, dan sayuran, dengan berbagai tingkat kematangan dari rare hingga well-done', 'menu-1768744918088-447417926.jpeg', 150000.00, 'makanan'),
(2, 'ice lemon tea', 'minuman segar perpaduan teh aromatik dan air perasan lemon asli yang memberikan rasa asam manis menyegarkan', 'menu-1768745510539-965479403.jpeg', 12000.00, 'minuman'),
(3, 'brownies', 'kue cokelat padat bertekstur lembut atau kenyal dengan rasa cokelat pekat, berbahan dasar cokelat batangan/bubuk, tepung, gula, dan telur, bisa dipanggang atau dikukus, dan bervariasi teksturnya (cakey, fudgy, chewy) serta sering ditambah kacang atau topping lain, menjadikannya camilan populer dari Amerika Serikat yang disajikan dalam potongan persegi', 'menu-1768745572607-125829535.jpeg', 5000.00, 'dessert');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(50) NOT NULL,
  `nama` varchar(250) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL,
  `no_telepon` varchar(20) NOT NULL,
  `foto` varchar(250) NOT NULL DEFAULT 'default-avatar.png',
  `roles` enum('user','admin') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `no_telepon`, `foto`, `roles`) VALUES
(3, 'windah', 'win@email.com', '$2b$10$Wb/UKbYhiE8EYzpmCfdYouF30C6ZoN0elEy.mrV75XPED2aPnslam', '81234567', '', 'user'),
(4, 'hadza', 'had@email.com', '$2b$10$D8pUIqc3DWq4ycXKMUZiIevoYr9fL8l4xt68C6IS8deM08GCZ4aWO', '81234567', '', 'user'),
(8, 'Ravlor', 'ravlor@email.com', '$2b$10$8LYZeUWrcXsG4QsrC39ln.bU5fqoP3MmfeVUD7qRJ9m/e/xUyc2Wu', '08123456789', 'avatar-1768745129953.jpeg', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `meja`
--
ALTER TABLE `meja`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `meja`
--
ALTER TABLE `meja`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
