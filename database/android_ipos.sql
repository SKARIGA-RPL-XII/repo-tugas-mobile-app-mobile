-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 16, 2026 at 02:17 PM
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
(1, 'Zundapp bmw750', 'Sepada montor zundapp frontend bla dyftdrtdgcfd rdfcfgdt tgfttuy', 'menu-1768569349901-851248932.jpeg', 15000000000.00, 'makanan'),
(2, 'Panzerwagen XII konigstiger ', 'Tank dust dust geda gedigedayo', 'menu-1768562829458-60366628.jpeg', 150000000.00, 'dessert'),
(3, 'Panzerwagen VII panther', 'Panther ngeng ngeng engegnegegegegnege ', 'menu-1768563110546-794945794.jpeg', 50000000.00, 'minuman');

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
(5, 'Ravlor', 'ravlor@email.com', '$2b$10$djJ5mZvwUqylTvJItO9UDO4NCtHSoQNKlyq6XTsOBAsoOs.4cMylG', '2147483647', '', 'admin');

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
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
