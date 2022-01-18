// Get dom elements we need for the progam
var displayContent = document.getElementById('content');
var shoppingCartContent = document.querySelector('.shopping-cart-content');
var totalPriceContent = document.querySelector('.shopping-cart-price');

// Init the product list and the shipport cart as objects. Each object will contain references as parameters and each references will contain products
let products = {};
let shoppingCart = {};

// Manually adding products in the database for debug
addProduct("lama", createProduct("Lama Parisen", "https://wallpaperaccess.com/full/1650011.jpg", "Il s'énerve quand on ne dit pas bonjour.", "1"));
addProduct("lama", createProduct("Lama BG", "https://scontent-cdt1-1.xx.fbcdn.net/v/t1.6435-9/fr/cp0/e15/q65/91056296_869092870184350_7482460704742572032_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=8024bb&_nc_ohc=2aW7gywoU34AX_YAwpS&_nc_ht=scontent-cdt1-1.xx&oh=00_AT9qIOoM54rRJ2Jwxhos88InT1VLy4ySbFEa3SmUu8xveQ&oe=6207B710", "Pour briller en soirée", "500"));
addProduct("lama", createProduct("Surprised Lama", "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6d285570-66c7-4983-b924-fe1e3d9dcc35/d1hsibk-b0cf73e5-571a-4efe-b6ab-5f0d78e83092.jpg/v1/fill/w_1600,h_1509,q_75,strp/funny_lama_by_searchmyheart_d1hsibk-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTUwOSIsInBhdGgiOiJcL2ZcLzZkMjg1NTcwLTY2YzctNDk4My1iOTI0LWZlMWUzZDlkY2MzNVwvZDFoc2liay1iMGNmNzNlNS01NzFhLTRlZmUtYjZhYi01ZjBkNzhlODMwOTIuanBnIiwid2lkdGgiOiI8PTE2MDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.4jK2wovlR9w1j3E9SwdS4DeTBRbQN2JikFGw4HcaLtU", "Il a vu ta tête", "15"));
addProduct("lama", createProduct("Lamasticot", "https://jvflux.fr/images/4/47/Lamasticot.PNG", "Le roi de tous les lamas", "1000000000"));
addProduct("alpaca", createProduct("Alpaga sexy", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Alpaca_-_panoramio_%28977%29.jpg/202px-Alpaca_-_panoramio_%28977%29.jpg", "RRRRRRRRR", "69"));
addProduct("vigogne", createProduct("vigogne surprise", "https://www.thoiry.net/sites/thoiry.net/files/2018-02/Vigogne1600x800.jpg", "c'est une vigogne", "150"));
addProduct("vigogne", createProduct("bébé vigogne", "https://www.photos-animaux.com/data/photos/93/926/92595.jpg", "c'est une vigogne", "50"));
addProduct("vigogne", createProduct("maman vigogne", "https://www.larousse.fr/encyclopedie/data/images/1002264-Vigogne.jpg", "L'amour maternal n'a pas deprix. Enfin si, mais c'est cher", "99999"));

// The first category of products is pre-selected
var clientCategory = Object.keys(products)[0];
// Then, we display the category
displayProducts(clientCategory);

// Adds the click listener event for the whole dom
document.addEventListener('click', dispatchInputs);

// Sets the initial price to zero
totalPriceContent.innerHTML = "0 €";


// Modify the product database
// Adds an object from a category
function addProduct(category, obj) {
    // If the category doesnt' exixts, creats ot
    if (!Array.isArray(products[category]))
        addProductCategory(category);
    products[category].push(obj);
    localStorage.setItem("products", JSON.stringify(products))
}

function addProductCategory(category) {
    products[category] = [];
}

function createProduct(name, picture, description, price) {
    let obj = {};

    obj["identifier"] = name.replace(" ", "-");
    obj["name"] = name;
    obj["picture"] = picture;
    obj["description"] = description;
    obj["price"] = price;

    return obj;
}

// An event is added once on the whole website. When the user clicks on something, the function will read what was clicked and decide if there is a set of functions associated to this event.
// Is better than looking for the dom and adding the element indivually
function dispatchInputs(event) {
    // Avoid refresh of the screen
    event.preventDefault;
    // Main page
    // Display the product of the selected category
    if (event.target.className.includes("category")) {
        registerCategory(event.target.id);
        displayProducts(event.target.id);
    }
    // Modal - Shopping Card
    // Adds an item in the shopping cart. If already added, add one more quantity.
    if (event.target.className.includes("buyable")) {
        addProductInShoppingCart(clientCategory, event.target.id, event.target.name);
        modifyShoppingCart();
        modifyPrice(clientCategory, event.target.id, "addition");
    }
    // Adds one more quantity an item in the shopping cart.
    if (event.target.className.includes("add")) {
        addProductInShoppingCart(event.target.parentNode.id.split(" ")[0], event.target.parentNode.id.split(" ")[1], event.target.parentNode.name);
        modifyShoppingCart();
        modifyPrice(event.target.parentNode.id.split(" ")[0], event.target.parentNode.id.split(" ")[1], "addition");
    }
    // Reduce by one an item in the shopping cart. Will remove the item if the quantity is reduced to zero.
    if (event.target.className.includes("remove")) {
        removeProductInShoppingCart(event.target.parentNode.id.split(" ")[0], event.target.parentNode.id.split(" ")[1], event.target.parentNode.name);
        modifyShoppingCart();
        modifyPrice(event.target.parentNode.id.split(" ")[0], event.target.parentNode.id.split(" ")[1], "substraction");
    }
}

// Modify the content of the main page.
// Removes all the products of a category. 
// Called first when the user clicks on an other category button. The next function called will draw the products of the categorgy
function displayBlankPage() {
    paragraphs = displayContent.getElementsByClassName("lama-card");
    // This trick is used because a for loop was not working
    // Probably linked to the garbage collector
    while (paragraphs[0])
        paragraphs[0].remove();
}

// Modify the content of the main page.
// Called after displayBlankPage()
// Display all the product of the selected category. The category "Lama" is selected by default.
function displayProducts(productType) {
    // Delete all the products of the former category
    displayBlankPage();

    // for all the products of a category of products
    for (let productIndex = 0; productIndex < products[productType].length; productIndex++) {
        const product = products[productType][productIndex];
        // Creates a new html card that will be displayed the product
        let newDiv = document.createElement("div");
        newDiv.setAttribute("class", "lama-card");
        displayContent.appendChild(newDiv);
        // Loops though all the attributes of a product
        // A product contains an identifier, a name, a picture, a description and a price
        // Adds the desired data to the created card
        for (const key in product) {

            if (key == "picture") {
                let newParagraph = document.createElement("img");
                newParagraph.setAttribute("class", "lama-photo");
                const element = product[key];
                newParagraph.src = element;
                newDiv.appendChild(newParagraph);
            }
            else {
                let newParagraph = document.createElement("p");
                newDiv.appendChild(newParagraph);
                const element = product[key];
                newParagraph.innerHTML += key + ": " + (element);
                if (key == "price") {
                    newParagraph.innerHTML += " €";
                }
            }
        };
        // We add the "add to shopping cart" button to the card 
        let addToCartButton = document.createElement("BUTTON");
        addToCartButton.innerText = "Ajouter au panier";
        // Inner data retrieved by the dispatchInputs() function when the users will click on the add to cart button "Ajouter au panier"
        addToCartButton.setAttribute("class", "btn btn-success buyable");
        addToCartButton.setAttribute("name", product["name"]);
        addToCartButton.setAttribute("id", product["identifier"]);
        newDiv.appendChild(addToCartButton);
    }
}

// Modify the content of the modal card showing the shopping cart.
// Refresh the content of the modal card according to the shoppingCart object.
// This is done before the card is displayed because boostrap modal cards can't be changed when the show animation is running
function modifyShoppingCart() {
    shoppingCartContent.innerHTML = "";

    // for all the categories of the shopping cart
    for (const key in shoppingCart) {
        if (Object.hasOwnProperty.call(shoppingCart, key)) {
            const shoppingCartCategory = shoppingCart[key];
            const keyName = key;

            // for all the property of a product
            for (const key in shoppingCartCategory) {
                if (Object.hasOwnProperty.call(shoppingCartCategory, key)) {
                    const elem = shoppingCartCategory[key];
                    // Adds a html node containing all the infos of the card
                    let newParagraph = document.createElement("p");
                    newParagraph.setAttribute("class", "d-flex");
                    newParagraph.innerHTML += "<p>" + elem.name + ". Number :" + elem.quantity + "</p>";
                    newParagraph.innerHTML += "<button class=\"add btn btn-success \">+</button>";
                    newParagraph.innerHTML += "<button class=\"remove btn btn-danger \">-</button>";
                    // Inner data retrieved by the dispatchInputs() function when the users will click on the button + or - 
                    newParagraph.setAttribute("id", keyName + " " + elem.id + " " + elem.quantity);
                    shoppingCartContent.appendChild(newParagraph);
                }
            }
        }
    }
}

// Modify the content of the modal card showing the shopping cart.
// Modify the price shown.
// modifyPrice(category, identifier, "addition") adds the price of the product on the total price. Called when the user clicks either on a product in the main page or the + on the modal card
// modifyPrice(category, identifier, "substraction") substract the price of the product on the total price. Is called when the user clicks in the - on the modal card
function modifyPrice(category, identifier, actionType) {

    // find the index of the product so we can get its price parameter
    let productIndex = products[category].findIndex(item => item.identifier == identifier);

    // Get the price of the product.
    let productPrice = 0;
    if (actionType === "addition") {
        productPrice = Number(products[category][productIndex].price);
    }
    // reverse the price of the product if the actionType equals substraction
    if (actionType === "substraction") {
        productPrice = -Number(products[category][productIndex].price);
    }

    // Get the current price from the HTML
    let currentPrice = Number(totalPriceContent.innerHTML.split(" ")[0]);
    // Calculate the new price
    let totalPrice = productPrice + currentPrice;

    // Displays the new price as a string
    totalPriceContent.innerHTML = totalPrice.toString() + " €";
}

// Modify the user input
// Register the last category clicked by the user
// Used when the user clicks on the button "Ajouter au panier" of a product so we know what category does the clicked product belongs to
function registerCategory(category) {
    clientCategory = category;
}

// Modify the shopping cart object
// Add a quantity of an object of a category in the shopping cart. 
// If the object doesn't exist in the shopping cart, creates the category, the object and adds it at a quantity of 1. 
function addProductInShoppingCart(category, id, name) {
    // If the category doesn't exist in the shopping cart, creates the category. 
    if (!Array.isArray(shoppingCart[category])) {
        shoppingCart[category] = [];
    }
    // If the object of the category doesn't exist in the shopping cart, creates it at a category of 1. 
    if (!Array.isArray(shoppingCart[category][id])) {
        let obj = [];
        obj.id = id;
        obj.name = name;
        obj.quantity = 1;
        shoppingCart[category][id] = obj;
    }
    // Add +1 quantity of an object of a category in the shopping cart. 
    else {
        shoppingCart[category][id].quantity++;
    }
}

// Modify the shopping cart object
// Reduce the quantity of an object of a category in the shopping cart. 
// If the quantity is zero, ask deleteZeroQuantities to remove the category
function removeProductInShoppingCart(category, id) {
    // If the category doesn't exist, quit without doing anything. This shouldn't happen.
    if (!Array.isArray(shoppingCart[category])) {
        return;
    }
    // Reduce the quantity of an object of a category in the shopping cart. 
    shoppingCart[category][id].quantity--;
    // If the quantity is zero, ask deleteZeroQuantities to remove the category
    if (Number(shoppingCart[category][id].quantity <= 0)) {
        deleteZeroQuantities(category);
    }
}

// Modify the shopping cart object
// Take a category on parameters. 
// Recreates the category without the products at zero quantity
function deleteZeroQuantities(category) {

    // New blank shopping cart category.
    let newShoppingCartCategory = [];
    for (const key in shoppingCart[category]) {
        if (Object.hasOwnProperty.call(shoppingCart[category], key)) {
            const element = shoppingCart[category][key];
            // All elements not at zero are added
            if (element.quantity != 0) {
                newShoppingCartCategory[key] = (element)
            }
        }
    }
    // We replace the outdated category by the newShoppingCartCategory, now without the 0 quantities
    shoppingCart[category] = newShoppingCartCategory;
}
