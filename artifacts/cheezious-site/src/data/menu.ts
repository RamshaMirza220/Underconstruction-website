export type MenuCategory = {
  id: string;
  name: string;
  image: string;
};

export type MenuItem = {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  startingPrice: boolean;
  description: string;
  image: string;
};

export const menuCategories: MenuCategory[] = [
  { id: 'thin-crust-pizza', name: 'Thin Crust Pizza', image: '/food-pizza.jpg' },
  { id: 'malai-tikka', name: 'Malai Tikka', image: '/food-pizza.jpg' },
  { id: 'beef-pepperoni-pizza', name: 'Beef Pepperoni Pizza', image: '/food-pizza.jpg' },
  { id: 'starters', name: 'Starters', image: '/food-wings.jpg' },
  { id: 'somewhat-local', name: 'Somewhat Local', image: '/food-pizza.jpg' },
  { id: 'somewhat-sooper', name: 'Somewhat Sooper', image: '/food-pizza.jpg' },
  { id: 'cheezy-treats', name: 'Cheezy Treats', image: '/food-pizza.jpg' },
  { id: 'pizza-deals', name: 'Pizza Deals', image: '/food-pizza.jpg' },
  { id: 'sandwiches-platters', name: 'Sandwiches & Platters', image: '/food-burger.jpg' },
  { id: 'special-pizza', name: 'Special Pizza', image: '/food-pizza.jpg' },
  { id: 'somewhat-amazing', name: 'Somewhat Amazing', image: '/food-burger.jpg' },
  { id: 'pastas', name: 'Pastas', image: '/food-pasta.svg' },
  { id: 'burgerz', name: 'Burgerz', image: '/food-burger.jpg' },
  { id: 'side-orders', name: 'Side Orders', image: '/food-fries.jpg' },
  { id: 'addons', name: 'Addons', image: '/food-fries.jpg' },
  { id: 'soft-drinks', name: 'Soft Drinks', image: '/food-fries.jpg' },
];

type MenuRow = [
  categoryId: string,
  name: string,
  price: number,
  startingPrice: boolean,
  description: string,
];

const rows: MenuRow[] = [
  ['thin-crust-pizza', 'Thin Crust Beef Pepperoni', 1480, true, 'A Crispy Thin Crust Topped With Beef Pepperoni, Mozzarella Cheese, And Rich Marinara Sauce'],
  ['thin-crust-pizza', 'Thin Crust Veggie Lover', 1290, true, 'Cheese Blend, Mushrooms, Sweet Corn, Black Olives, Onions, Capsicum And Tomatoes'],
  ['thin-crust-pizza', 'Thin Crust Cheese Lover', 1290, true, 'Extra Special Mozzarella Blend And Signature Sauce On A Crispy Thin Crust.'],
  ['thin-crust-pizza', 'Thin Crust Fajita', 1290, true, 'Tender Fajita Chicken With Mozzarella Blend, Onions And Bell Pepper On A Crispy Thin Crust.'],
  ['thin-crust-pizza', 'Thin Crust Tikka', 1290, true, 'Juicy Tikka Chicken, Mozzarella Cheese Blend, And Onions Served On A Perfectly Crispy Thin Crust.'],

  ['malai-tikka', 'Malai Tikka', 1530, true, 'A Flavorful Pizza Loaded With Fresh BBQ Malai Tikka Chunks And Topped With A Swirl Of Sauce.'],
  ['beef-pepperoni-pizza', 'Beef Pepperoni Pizza', 1480, true, 'Freshly Baked Pan Crust, Soft Inside And Golden-Crisp Outside, Topped With Beef Pepperoni.'],

  ['starters', 'Cheezy Sticks', 600, false, 'Freshly Baked Bread Filled With The Yummiest Cheese Blend To Satisfy Your Cravings.'],
  ['starters', 'Oven Baked Wings', 580, true, 'Fresh Oven Baked Wings Served With Dip Sauce.'],
  ['starters', 'Flaming Wings', 620, true, 'Fresh Oven Baked Wings Tossed In Hot Peri Peri Sauce And Served With Dip Sauce.'],
  ['starters', 'Calzone Chunks', 1100, false, '4 Pcs Stuffed Calzone Chunks Served With Sauce & Fries.'],
  ['starters', 'Arabic Rolls', 660, false, '4 Pcs Arabic Rolls Stuffed With The Yummiest Mix Served With Sauce.'],
  ['starters', 'Behari Rolls', 660, false, '4 Pcs Behari Rolls Stuffed With The Yummiest Mix Served With Sauce.'],

  ['somewhat-local', 'Chicken Tikka', 660, true, 'Topping Of Chicken Tikka Chunks With Savoury Onion'],
  ['somewhat-local', 'Chicken Fajita', 660, true, 'An Authentic Taste Of Fajita Marinated Chicken, Onion And Bell Peppers.'],
  ['somewhat-local', 'Chicken Lover', 660, true, 'Extreme Quantity Of Chicken And Onion With Rich Mozzarella Cheese.'],
  ['somewhat-local', 'Chicken Tandoori', 660, true, 'Our Traditionally Developed Tandoori Chicken With Onion, Olives, Jalapeno And Tomatoes.'],
  ['somewhat-local', 'Hot n Spicy', 660, true, 'Hot And Spicy Chicken Onion With Jalapeno.'],
  ['somewhat-local', 'Vegetable Pizza', 660, true, 'Vegetables With Pizza Sauce And Cheese.'],

  ['somewhat-sooper', 'Euro', 660, true, 'A Delightful Combination Of Specially Marinated Smoked Chicken With Bell Pepper And Olives.'],
  ['somewhat-sooper', 'Chicken Supreme', 660, true, 'A Combination Of 3 Flavors Of Chicken, Black Olives, Mushrooms, Bell Pepper And Onion.'],
  ['somewhat-sooper', 'Black Pepper Tikka', 660, true, 'A Blend Of Marinated Black Pepper Chicken, Onion And Bell Pepper.'],
  ['somewhat-sooper', 'Sausage Pizza', 660, true, 'Chicken Sausages, Pizza Sauce, And Cheese.'],
  ['somewhat-sooper', 'Cheese Lover Pizza', 660, true, 'Yummiest Blend Of Cheese And Pizza Sauce'],
  ['somewhat-sooper', 'Chicken Pepperoni', 660, true, 'Chicken Pepperoni, Pizza Sauce And Cheese.'],
  ['somewhat-sooper', 'Chicken Mushroom', 660, true, 'Tender Chunks Of Marinated Grilled Chicken Tikka, Lots Of Mushrooms, Onion And Tomatoes.'],

  ['cheezy-treats', 'Cheezious Special', 1480, true, 'Delicious Special Chicken With Black Olives, Sausages And Bell Pepper.'],
  ['cheezy-treats', 'Behari Kabab', 1480, true, 'Enjoy Special Chicken Behari Kabab, Grilled Chicken With Onion Jalapenos And Ginger.'],
  ['cheezy-treats', 'Chicken Extreme', 1480, true, 'Combination Of 3 Flavors Of Chicken With Onion, Bell Pepper, Green Olives, Mushrooms.'],

  ['pizza-deals', 'Small Pizza Deal', 720, true, 'Enjoy Any Flavor From Our Local Or Sooper Flavor Category Along With Regular Soft Drink.'],
  ['pizza-deals', 'Regular Pizza Deal', 1390, true, '1 Regular Pizza And 2 Regular Drinks.'],
  ['pizza-deals', 'Large Pizza Deal', 1900, true, 'Any Flavor From Local Or Over The Sea Flavor Category & 1 Liter Drink.'],

  ['sandwiches-platters', 'Mexican Sandwich', 880, false, 'Mozzarella Dipped Black Pepper Chicken Topped With Garlic Sauce And Tomatoes Served With Fries.'],
  ['sandwiches-platters', 'Pizza Stacker', 880, false, 'A Unique Blend Of Delicious Sauce, Crispy Chicken And Baked Bread'],
  ['sandwiches-platters', 'Euro Sandwich', 880, false, 'Mozzarella Dipped Tikka Chicken Topped With Garlic Sauce And Pineapple'],
  ['sandwiches-platters', 'Classic Roll Platter', 1150, false, '4 Pcs Behari Rolls, 4 Pcs Arabic Rolls Served With Fries & Sauce.'],
  ['sandwiches-platters', 'Special Roasted Platter', 1150, false, '4 Pcs Behari Rolls, 6 Pcs Wings Served With Fries & Sauce.'],

  ['special-pizza', 'Crown Crust', 1480, true, 'Scrumptious Pizza With A Yummy Blend Of Grilled Chicken, Olives, Onion, Capsicum And Tomatoes.'],
  ['special-pizza', 'Stuff Crust Pizza', 1530, true, 'Special Chicken, Green Olives, Mushrooms, With The Crust Filled With Cheese Or Kabab.'],
  ['special-pizza', 'Thin Crust Beef Pepperoni', 1480, true, 'A Crispy Thin Crust Topped With Beef Pepperoni, Mozzarella Cheese, And Rich Marinara Sauce'],
  ['special-pizza', 'Malai Tikka', 1530, true, 'A Flavorful Pizza Loaded With Fresh BBQ Malai Tikka Chunks And Topped With A Swirl Of Sauce.'],

  ['somewhat-amazing', 'Somewhat Amazing 1', 1190, true, '2 Bazinga, Regular Fries, 2 Regular Drinks'],
  ['somewhat-amazing', 'Somewhat Amazing 2', 1670, true, '2 Bazinga Burger, 2 Pcs Chicken, Large Fries, 2 Regular Drinks'],
  ['somewhat-amazing', 'Somewhat Amazing 3', 1800, true, '3 Bazinga Burger, Large Fries, 1 Liter Drink'],
  ['somewhat-amazing', 'Somewhat Amazing 4', 2050, true, '3 Bazinga Burger, 3 Pcs Chicken, 1 Liter Drink'],

  ['pastas', 'Fettuccine Alfredo', 1000, false, 'Pasta Made In The Yummiest White Sauce With Chicken Chunks Topped With Cheese.'],
  ['pastas', 'Crunchy Chicken Pasta', 910, false, 'Yummiest Macaroni Pasta In White Sauce Topped With Crispy Chicken And Cheese.'],

  ['burgerz', 'Reggy Burger', 380, true, 'Perfectly Fried Chicken Patty With Fresh Lettuce And Sauce In A Cornmeal/ Corn Dusted Bun.'],
  ['burgerz', 'Bazinga Burger', 540, true, 'Crispy Fried To Perfection Boneless Thigh With Mayo And Lettuce Held In A Corn Dusted Bun.'],
  ['burgerz', 'Bazooka', 600, true, 'Tender, Spicy Chicken Strips Paired With Mayo, Pickles, Jalapenos, And Signature Sauce.'],

  ['side-orders', 'Fries', 210, true, 'Golden, crispy fries.'],
  ['side-orders', 'Chicken Nuggets', 430, true, '5 Pcs'],
  ['side-orders', 'Fried Chicken', 710, true, 'Crispy Chicken'],
  ['side-orders', 'Chicken Strips', 390, true, '3 Chicken Strips With A Sauce To Choose'],

  ['addons', 'Juice', 60, false, ''],
  ['addons', 'Mayo Dip', 80, false, ''],
  ['addons', 'Water Small', 60, false, ''],
  ['addons', 'Diet Drink', 95, true, 'Diet Drink'],
  ['addons', 'Chilli Lime', 80, false, 'Chilli Lime'],
  ['addons', 'Chipotle', 80, false, 'Chipotle'],

  ['soft-drinks', 'Diet Drink', 95, true, 'Diet Drink'],
  ['soft-drinks', 'Chilli Lime', 80, false, 'Chilli Lime'],
  ['soft-drinks', 'Chipotle', 80, false, 'Chipotle'],
];

const categoryImages: Record<string, string> = Object.fromEntries(
  menuCategories.map((category) => [category.id, category.image]),
);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const menuItems: MenuItem[] = rows.map(
  ([categoryId, name, price, startingPrice, description], index) => ({
    id: `${categoryId}-${slugify(name)}-${index}`,
    name,
    categoryId,
    price,
    startingPrice,
    description,
    image: categoryImages[categoryId] ?? '/food-pizza.jpg',
  }),
);

export const homeMenuCategories = [
  menuCategories[0],
  menuCategories[1],
  menuCategories[2],
  menuCategories[3],
];
