-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 07, 2026 at 06:00 AM
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
-- Table structure for table `detail_order`
--

CREATE TABLE `detail_order` (
  `id` int(50) NOT NULL,
  `order_id` int(50) NOT NULL,
  `menu_id` int(50) NOT NULL,
  `quantity` int(11) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `detail_order`
--

INSERT INTO `detail_order` (`id`, `order_id`, `menu_id`, `quantity`, `subtotal`) VALUES
(29, 12, 2, 1, 12000.00),
(30, 12, 1, 1, 150000.00),
(31, 12, 3, 1, 5000.00),
(32, 13, 1, 1, 150000.00),
(33, 14, 1, 1, 150000.00),
(34, 15, 1, 2, 300000.00),
(35, 15, 2, 2, 24000.00),
(36, 15, 3, 2, 10000.00),
(37, 16, 1, 1, 150000.00);

-- --------------------------------------------------------

--
-- Table structure for table `keranjang`
--

CREATE TABLE `keranjang` (
  `id` int(50) NOT NULL,
  `user_id` int(50) NOT NULL,
  `menu_id` int(50) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `keranjang`
--

INSERT INTO `keranjang` (`id`, `user_id`, `menu_id`, `quantity`) VALUES
(9, 3, 1, 3),
(10, 3, 2, 1),
(11, 3, 3, 1),
(12, 10, 1, 4),
(13, 10, 2, 2),
(14, 10, 3, 1);

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
(1, 1, 'dibersihkan', '2026-01-20 01:38:15'),
(2, 2, 'ditempati', '2026-01-18 14:56:16'),
(3, 3, 'dibersihkan', '2026-01-20 02:23:42'),
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
-- Table structure for table `no_antrian`
--

CREATE TABLE `no_antrian` (
  `id` int(50) NOT NULL,
  `nomor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(50) NOT NULL,
  `customer_id` int(50) NOT NULL,
  `kode_order` varchar(20) NOT NULL,
  `order_date` date DEFAULT curdate(),
  `total_harga` decimal(15,2) NOT NULL,
  `total_pembayaran` decimal(15,2) NOT NULL,
  `meja_id` int(50) DEFAULT NULL,
  `no_antrian_id` int(50) DEFAULT NULL,
  `status_order` enum('belum','sudah','pending') DEFAULT 'pending',
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_id`, `kode_order`, `order_date`, `total_harga`, `total_pembayaran`, `meja_id`, `no_antrian_id`, `status_order`, `create_at`) VALUES
(12, 3, 'INV-1768855905787', '2026-01-20', 167000.00, 167000.00, 1, NULL, 'sudah', '2026-01-19 20:51:45'),
(13, 3, 'INV-1768856093835', '2026-01-20', 150000.00, 150000.00, 1, NULL, 'sudah', '2026-01-19 20:54:53'),
(14, 3, 'INV-1768856708930', '2026-01-20', 150000.00, 150000.00, 1, NULL, 'sudah', '2026-01-19 21:05:08'),
(15, 10, 'INV-1768872956378', '2026-01-20', 334000.00, 334000.00, 1, NULL, 'sudah', '2026-01-20 01:35:56'),
(16, 10, 'INV-1768875780427', '2026-01-20', 150000.00, 150000.00, 3, NULL, 'sudah', '2026-01-20 02:23:00');

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
(3, 'windah', 'wins@email.com', '$2b$10$amkGaL3pJi2NOgpJu7wJI.1rbsj4q9C4UfIzvjLQTEo4CeanBFq26', '0812345432', 'avatar-1768842169371.jpeg', 'user'),
(8, 'Ravlor', 'ravlor@email.com', '$2b$10$8LYZeUWrcXsG4QsrC39ln.bU5fqoP3MmfeVUD7qRJ9m/e/xUyc2Wu', '08123456789', 'avatar-1768745129953.jpeg', 'admin'),
(10, 'moreno', 'mor@email.com', '$2b$10$J4vyUrxyI3pSDYKDXas/iOls7xmHb03YBJSL6CeTSxrtPkbIQHBWm', '08765457', 'avatar-1768873181249.jpeg', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detail_order`
--
ALTER TABLE `detail_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `menu_id` (`menu_id`);

--
-- Indexes for table `keranjang`
--
ALTER TABLE `keranjang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `menu_id` (`menu_id`);

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
-- Indexes for table `no_antrian`
--
ALTER TABLE `no_antrian`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `meja_id` (`meja_id`),
  ADD KEY `no_antrian_id` (`no_antrian_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `detail_order`
--
ALTER TABLE `detail_order`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `keranjang`
--
ALTER TABLE `keranjang`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `meja`
--
ALTER TABLE `meja`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `no_antrian`
--
ALTER TABLE `no_antrian`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detail_order`
--
ALTER TABLE `detail_order`
  ADD CONSTRAINT `detail_order_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `detail_order_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`);

--
-- Constraints for table `keranjang`
--
ALTER TABLE `keranjang`
  ADD CONSTRAINT `keranjang_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `keranjang_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`meja_id`) REFERENCES `meja` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
