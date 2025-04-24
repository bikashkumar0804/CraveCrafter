document.addEventListener('DOMContentLoaded', () => {
   const form = document.getElementById('book-form');

   form.addEventListener('submit', async (e) => {
       e.preventDefault();

       const formData = {
           dishName: form.dishName.value,
           email: form.email.value,
           ingredients: form.ingredients.value,
           quantity: form.quantity.value,
           budget: form.budget.value,
           deliveryMethod: form.deliveryMethod.value,
           specialInstructions: form.specialInstructions.value,
           image: form.image.value
       };

       try {
           const response = await fetch('http://localhost:4000/bookings', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify(formData)
           });

           const data = await response.json();

           if (response.ok) {
               alert('Your food request has been posted!');
               form.reset();
           } else {
               alert('Error: ' + data.message);
           }
       } catch (err) {
           alert('Request failed. Is the server running?');
           console.error(err);
       }
   });
});
