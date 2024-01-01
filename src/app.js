const itemDetailModal = document.querySelector('#item-detail-modal');

document.addEventListener('alpine:init', () => {
    Alpine.data('products', () => ({
        items: [
            {id: 1, name: 'Robusta Brazil', img: '1.jpg', price: 5.5},
            {id: 2, name: 'Arabica Blend', img: '2.jpg', price: 4.5},
            {id: 3, name: 'Primo Passo', img: '3.jpg', price: 4},
            {id: 4, name: 'Aceh Gayo', img: '4.jpg', price: 5.3},
            {id: 5, name: 'Sumatra Mandheling', img: '5.jpg', price: 5.8}
        ]
    }));

    Alpine.store('details', {
        selectedItem: {},
        detailItem(product) {
            console.log(product);
            this.selectedItem = product;
            itemDetailModal.style.display = 'flex';
        },
        closeDetail() {
            itemDetailModal.style.display = 'none';
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
                this.total += parseFloat(newItem.price);
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
                this.total += parseFloat(newItem.price);
            } else {
                // jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada di cart
                this.items = this.items.map((item) => {
                    // jika barang berbeda
                    if (item.id !== newItem.id) {
                        return item;
                    } else {
                        // jika barang sudah ada, tambah quantity dan totalnya
                        item.quantity++;
                        item.total = parseFloat(item.price * item.quantity);
                        this.quantity++;
                        this.total += parseFloat(item.price);
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
                        item.total = parseFloat(item.price * item.quantity);
                        this.quantity--;
                        this.total -= parseFloat(item.price);
                        return item;
                    }
                });
            } else if (cartItem.quantity === 1) {
                // jika barangnya sisa 1
                this.items = this.items.filter((item) => item.id !== id);
                this.quantity--;
                this.total -= parseFloat(cartItem.price);
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
                this.total -= parseFloat(removedItem.total);

                // Hapus item dari array
                this.items.splice(cartItemIndex, 1);
            }
        }
    });
});

// konversi ke USD
const usd = (number) => {
    return new Intl.NumberFormat('en-EN', {
        style: 'currency',
        currency: 'USD'
        // minimumFractionDigits: 0
    }).format(number);
};
