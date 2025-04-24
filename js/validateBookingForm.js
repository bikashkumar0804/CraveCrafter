$(document).ready(function () {
    $("#book-form").validate({
        rules: {
            dishName: {
                required: true,
                minlength: 3
            },
            email: {
                required: true,
                email: true,
            },
            budget: {
                number: true
            },
            ingredients: {
                required: false
            },
            quantity: {
                required: true
            },
            deliveryMethod: "required",
            specialInstructions: {
                required: false
            },
            image: {
                url: true
            }
        },
        messages: {
            dishName: {
                required: "Please enter the name of the dish",
                minlength: "Dish name must be at least 3 characters long"
            },
            email:{
                required:"Please enter a Valid email id"
            },
            quantity: {
                required: "Please choose the number of servings"
            },
            deliveryMethod: "Please select a delivery method"
        },
        submitHandler: function (form) {
            var formData = {
                dishName: $("#dishName").val(),
                email: $("#email").val(),
                budget: $("#budget").val(),
                ingredients: $("#ingredients").val(),
                quantity: $("#quantity").val(),
                deliveryMethod: $("#deliveryMethod").val(),
                specialInstructions: $("#specialInstructions").val(),
                image: $("#image").val()
            };

            $.ajax({
                url: "http://localhost:3000/bookings",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(formData),
                success: function (response) {
                    alert("Request submitted successfully!");
                    form.reset();
                },
                error: function () {
                    alert("Failed to submit request. Please try again.");
                }
            });
        }
    });
});
