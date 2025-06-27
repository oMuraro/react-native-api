-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 21-Mar-2025 às 19:29
-- Versão do servidor: 10.4.27-MariaDB
-- versão do PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `sistema_manutencao`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `equipamentos`
--

CREATE TABLE `equipamentos` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  `numero_serie` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `equipamentos`
--

INSERT INTO `equipamentos` (`id`, `nome`, `descricao`, `numero_serie`) VALUES
(2, 'antena', 'parabolica', '191919'),
(3, 'Serra Elétrica', 'Corte em arvores', 'A918K-91KM3');

-- --------------------------------------------------------

--
-- Estrutura da tabela `manutencoes`
--

CREATE TABLE `manutencoes` (
  `id` int(11) NOT NULL,
  `equipamento_id` int(11) NOT NULL,
  `tecnico_id` int(11) NOT NULL,
  `servico_id` int(11) NOT NULL,
  `data_inicio` date NOT NULL,
  `data_prevista_termino` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `servicos`
--

CREATE TABLE `servicos` (
  `id` int(11) NOT NULL,
  `descricao` text NOT NULL,
  `custo` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `servicos`
--

INSERT INTO `servicos` (`id`, `descricao`, `custo`) VALUES
(2, 'Arrumar Serra', '600.00');

-- --------------------------------------------------------

--
-- Estrutura da tabela `tecnicos`
--

CREATE TABLE `tecnicos` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `contato` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `tecnicos`
--

INSERT INTO `tecnicos` (`id`, `nome`, `contato`) VALUES
(2, 'José', '192981849');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `equipamentos`
--
ALTER TABLE `equipamentos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_serie` (`numero_serie`);

--
-- Índices para tabela `manutencoes`
--
ALTER TABLE `manutencoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `equipamento_id` (`equipamento_id`),
  ADD KEY `tecnico_id` (`tecnico_id`),
  ADD KEY `servico_id` (`servico_id`);

--
-- Índices para tabela `servicos`
--
ALTER TABLE `servicos`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `tecnicos`
--
ALTER TABLE `tecnicos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `equipamentos`
--
ALTER TABLE `equipamentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `manutencoes`
--
ALTER TABLE `manutencoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `servicos`
--
ALTER TABLE `servicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `tecnicos`
--
ALTER TABLE `tecnicos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `manutencoes`
--
ALTER TABLE `manutencoes`
  ADD CONSTRAINT `manutencoes_ibfk_1` FOREIGN KEY (`equipamento_id`) REFERENCES `equipamentos` (`id`),
  ADD CONSTRAINT `manutencoes_ibfk_2` FOREIGN KEY (`tecnico_id`) REFERENCES `tecnicos` (`id`),
  ADD CONSTRAINT `manutencoes_ibfk_3` FOREIGN KEY (`servico_id`) REFERENCES `servicos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
