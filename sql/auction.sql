CREATE TABLE `auction_items` (
  `id` int(11) NOT NULL,
  `owner_id` int(50) NOT NULL,
  `item_id` int(50) NOT NULL,
  `item_object_id` int(50) NOT NULL,
  `item_count` int(50) NOT NULL,
  `item_enchant_level` int(50) NOT NULL,
  `item_type` varchar(50) NOT NULL,
  `item_grade` varchar(50) NOT NULL,
  `item_slot` varchar(50) NOT NULL,
  `price_count` int(50) NOT NULL,
  `price_id` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `auction_items_sold` (
  `id` int(11) NOT NULL,
  `owner_id` int(50) NOT NULL,
  `item_id` int(50) NOT NULL,
  `item_count` int(50) NOT NULL,
  `item_enchant_level` int(50) NOT NULL,
  `price_count` int(50) NOT NULL,
  `price_id` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


ALTER TABLE `auction_items`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `auction_items_sold`
  ADD PRIMARY KEY (`id`);


ALTER TABLE `auction_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `auction_items_sold`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;