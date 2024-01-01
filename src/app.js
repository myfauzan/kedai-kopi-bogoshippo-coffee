document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            {id: 1, name: 'Robusta Brazil', img: '1.jpg', price: 40000},
            {id: 2, name: 'Arabica Blend', img: '2.jpg', price: 45000},
            {id: 3, name: 'Primo Passo', img: '3.jpg', price: 43000},
            {id: 4, name: 'Aceh Gayo', img: '4.jpg', price: 53000},
            {id: 5, name: 'Sumatra Mandheling', img: '5.jpg', price: 58000}
        ]
    }));

    Alpine.store('details', {
        showDetail: false,
        selectedItem: {},
        detailItem(product) {
            this.selectedItem = product;
            this.showDetail = true;
            console.log(product, this.showDetail);
        }
    });

    Alpine.store('cart', {
        items: [],
        total: 0,
        quantity: 0,
        addItem(newItem) {
            // cek apakah ada barang yang sama
            const cartItem = this.items.find((item) => item.id === newItem.id);

            // jika belum ada / cart masih kosong
            if (!cartItem) {
                this.items.push({
                    ...newItem,
                    quantity: 1,
                    total: newItem.price
                });
                this.quantity++;
                this.total += newItem.price;
            } else {
                // jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
                this.items = this.items.map((item) => {
                    // jika barang berbeda
                    if (item.id !== newItem.id) {
                        return item;
                    } else {
                        // jika barang sudah ada tidak menambahkan
                        return item;
                    }
                });
            }
            console.log(this.total);
        },

        add(newItem) {
            // cek apakah ada barang yang sama
            const cartItem = this.items.find((item) => item.id === newItem.id);

            // jika belum ada / cart masih kosong
            if (!cartItem) {
                this.items.push({
                    ...newItem,
                    quantity: 1,
                    total: newItem.price
                });
                this.quantity++;
                this.total += newItem.price;
            } else {
                // jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
                this.items = this.items.map((item) => {
                    // jika barang berbeda
                    if (item.id !== newItem.id) {
                        return item;
                    } else {
                        // jika barang sudah ada, tambah quantity dan totalnya
                        item.quantity++;
                        item.total = item.price * item.quantity;
                        this.quantity++;
                        this.total += item.price;
                        return item;
                    }
                });
            }
            console.log(this.total);
        },

        remove(id) {
            // ambil item yang mau diremove berdasarkan id nya
            const cartItem = this.items.find((item) => item.id === id);

            // jika item lebih dari 1
            if (cartItem.quantity > 1) {
                // telusuri 1 1
                this.items = this.items.map((item) => {
                    // jika bukan barang yang diklik
                    if (item.id !== id) {
                        return item;
                    } else {
                        item.quantity--;
                        item.total = item.price * item.quantity;
                        this.quantity--;
                        this.total -= item.price;
                        return item;
                    }
                });
            } else if (cartItem.quantity === 1) {
                // jika barangnya sisa 1
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= cartItem.price;
            }
        },
        removeItem(id) {
            // Temukan item yang akan dihapus berdasarkan ID
            const cartItemIndex = this.items.findIndex(
                (item) => item.id === id
            );

            // Jika barangnya tidak -1
            if (cartItemIndex !== -1) {
                const removedItem = this.items[cartItemIndex];

                // Kurangi quantity dan total sesuai dengan item yang dihapus
                this.quantity -= removedItem.quantity;
                this.total -= removedItem.total;

                // Hapus item dari array
                this.items.splice(cartItemIndex, 1);
            }
        }
    });
});

// Form Validation
const checkoutButton = document.querySelector('.checkout-button');
checkoutButton.disabled = true;

const form = document.querySelector('#checkoutForm');

form.addEventListener('keyup', function () {
    for (let i = 0; i < form.elements.length; i++) {
        if (form.elements[i].value.length !== 0) {
            checkoutButton.classList.remove('disabled');
            checkoutButton.classList.add('disabled');
        } else {
            return false;
        }
    }

    checkoutButton.disabled = false;
    checkoutButton.classList.remove('disabled');
});

// kirim data ketika tombol checkout diklik
checkoutButton.addEventListener('click', async function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);
    const objData = Object.fromEntries(data);
    // const message = formatMessage(objData);
    // window.open(
    //     'http://wa.me/62089628863724?text=' + encodeURIComponent(message)
    // );

    // minta transaction token menggunakan ajax /fetch
    try {
        const response = await fetch('php/placeOrder.php', {
            method: 'POST',
            body: data
        });
        const token = await response.text();
        window.snap.pay(token);
        console.log(token);
    } catch (err) {
        console.log(err.message);
    }

    console.log(objData);
});

// format pesan whatsapp
const formatMessage = (obj) => {
    return `Data Customer
    Nama: ${obj.name}
    Email: ${obj.email}
    No. Hp: ${obj.phone}
Data Pesanan
    ${JSON.parse(obj.items).map(
        (item) => `${item.name} (${item.quantity} x ${usd(item.total)}) \n`
    )}
TOTAL: ${usd(obj.total)}
Terima kasih.`;
};

// konversi ke USD
const usd = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};
