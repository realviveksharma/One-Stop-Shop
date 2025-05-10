if(document.cookie.indexOf(',counter=')>=0)
{
    let counter = document.cookie.split(',')[1].split('=')[1]
    document.getElementById("badge").innerHTML = counter;
}

let cartContainer = document.getElementById('cartContainer')

let boxContainerDiv = document.createElement('div')
boxContainerDiv.id = 'boxContainer'

// DYNAMIC CODE TO SHOW THE SELECTED ITEMS IN YOUR CART
function dynamicCartSection(ob, itemCounter) {
    let boxDiv = document.createElement('div');
    boxDiv.id = 'box';

    // Product Image
    let boxImg = document.createElement('img');
    boxImg.src = ob.preview;
    boxDiv.appendChild(boxImg);

    // Product Name and Counter Controls
    let boxh3 = document.createElement('div');
    boxh3.style.display = 'flex';
    boxh3.style.flexDirection = 'column';
    boxh3.style.gap = '10px';

    let nameSpan = document.createElement('span');
    nameSpan.textContent = ob.name;

    let counterDiv = document.createElement('div');
    counterDiv.style.display = 'inline-flex';
    counterDiv.style.alignItems = 'center';
    counterDiv.style.gap = '5px';

    let counterText = document.createElement('span');
    counterText.textContent = 'Quantity: ';

    // Decrement Button
    let minusBtn = document.createElement('button');
    minusBtn.textContent = '−';

    // Counter Value
    let counterSpan = document.createElement('span');
    counterSpan.textContent = itemCounter;

    // Increment Button
    let plusBtn = document.createElement('button');
    plusBtn.textContent = '+';

    counterDiv.appendChild(counterText);
    counterDiv.appendChild(minusBtn);
    counterDiv.appendChild(counterSpan);
    counterDiv.appendChild(plusBtn);

    // Remove Item 
    let removeBtn = document.createElement('button')
    removeBtn.textContent = 'Remove Item';
    
    // Amount
    let boxh4 = document.createElement('h4');
    let h4Text = document.createTextNode('Amount: Rs' + (ob.price * itemCounter));
    boxh4.appendChild(h4Text);

    boxh3.appendChild(nameSpan);
    boxh3.appendChild(counterDiv);
    boxh3.appendChild(removeBtn);
    boxh3.appendChild(boxh4);
    boxDiv.appendChild(boxh3);

    // Counter Button Logic
    plusBtn.addEventListener('click', () => {
        let items = document.cookie.split(',')[0].split('=')[1].split(" ");
        let index = items.indexOf(ob.id);
        if (index !== -1) {
            itemCounter++;
            counterSpan.textContent = itemCounter;
            boxh4.textContent = 'Amount: Rs' + (ob.price * itemCounter);
            items.push(ob.id);
            let newItems = items.join(" ");
            let orderId = newItems;
            let newCounter = items.length - 1;
            let newCookie = "orderId=" + orderId + "," + "counter=" + newCounter;
            document.cookie = newCookie;
            document.getElementById("badge").innerHTML = newCounter;
            totalAmount = totalAmount + ob.price;
            amountUpdate(totalAmount);
            document.getElementById("totalItem").innerHTML = ('Total Items: ' + newCounter);
        }
    });

    minusBtn.addEventListener('click', () => {
        let items = document.cookie.split(',')[0].split('=')[1].split(" ");
        let index = items.indexOf(ob.id);
        if (index !== -1) {
            itemCounter--;
            if (itemCounter<1){
                boxDiv.remove();
                // window.location.reload();
            } else{
                counterSpan.textContent = itemCounter;
                boxh4.textContent = 'Amount: Rs' + (ob.price * itemCounter);
            }
            items.splice(index, 1); // remove one item at that index
            let newItems = items.join(" ");
            let orderId = newItems;
            let newCounter = items.length - 1;
            let newCookie = "orderId=" + orderId + "," + "counter=" + newCounter;
            document.cookie = newCookie;
            document.getElementById("badge").innerHTML = newCounter;
            totalAmount = totalAmount - ob.price;
            amountUpdate(totalAmount);
            document.getElementById("totalItem").innerHTML = ('Total Items: ' + newCounter);
        }
    });

    removeBtn.addEventListener('click', () => {
        boxDiv.remove();
        let items = document.cookie.split(',')[0].split('=')[1].split(" ");
        items = items.filter(item => item !== ob.id);
        let newItems = items.join(" ");
        let orderId = newItems;
        let newCounter = items.length - 1;
        let newCookie = "orderId=" + orderId + "," + "counter=" + newCounter;
        document.cookie = newCookie;
        document.getElementById("badge").innerHTML = newCounter;
        totalAmount = totalAmount - (ob.price * itemCounter);
        amountUpdate(totalAmount);
        document.getElementById("totalItem").innerHTML = ('Total Items: ' + newCounter);
    })

    // Now append boxDiv to your container (boxContainerDiv)
    boxContainerDiv.appendChild(boxDiv);
    cartContainer.appendChild(boxContainerDiv)
    cartContainer.appendChild(totalContainerDiv)
}

let totalContainerDiv = document.createElement('div')
totalContainerDiv.id = 'totalContainer'

let totalDiv = document.createElement('div')
totalDiv.id = 'total'
totalContainerDiv.appendChild(totalDiv)

let totalh2 = document.createElement('h2')
let h2Text = document.createTextNode('Total Amount')
totalh2.appendChild(h2Text)
totalDiv.appendChild(totalh2)

// TO UPDATE THE TOTAL AMOUNT
function amountUpdate(amount)
{
    if(document.getElementById('toth4')){
        document.getElementById('toth4').textContent = `Amount : Rs ${amount}`
    } else{
        let totalh4 = document.createElement('h4')
        totalh4.id = 'toth4'
        let totalh4Text = document.createTextNode('Amount: Rs ' + amount)
        totalh4.appendChild(totalh4Text)
        totalDiv.appendChild(totalh4)
        totalDiv.appendChild(buttonDiv)
    }
}

let buttonDiv = document.createElement('div')
buttonDiv.id = 'button'
totalDiv.appendChild(buttonDiv)

let buttonTag = document.createElement('button')
buttonTag.id = 'place';
buttonDiv.appendChild(buttonTag)

let buttonLink = document.createElement('a')
buttonLink.href = '/orderPlaced.html?'
buttonLink.textContent = 'Place Order';
buttonTag.appendChild(buttonLink)

buttonText = document.createTextNode('Place Order')
//dynamicCartSection()
// console.log(dynamicCartSection());

// BACKEND CALL
let httpRequest = new XMLHttpRequest()
let totalAmount = 0
httpRequest.onreadystatechange = function()
{
    if(this.readyState === 4)
    {
        if(this.status == 200)
        {
            let contentTitle = JSON.parse(this.responseText)
            let counter = Number(document.cookie.split(',')[1].split('=')[1])
            document.getElementById("totalItem").innerHTML = ('Total Items: ' + counter)

            let item = document.cookie.split(',')[0].split('=')[1].split(" ")
            const frequency = item.reduce((count, value) => {
                count[value] = (count[value] || 0) + 1;
                return count;
            }, {});
            delete frequency[0];

            for (const id in frequency) {
                // Find the product with this id
                const product = contentTitle.find(p => p.id == id);
                if (product) {
                    totalAmount += product.price * frequency[id];
                    dynamicCartSection(contentTitle[Number(id) - 1], frequency[id])
                }
            }
            amountUpdate(totalAmount)
        }
    }
}

httpRequest.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product', true)
httpRequest.send()