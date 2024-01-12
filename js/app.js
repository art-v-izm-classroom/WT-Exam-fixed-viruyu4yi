document.addEventListener("DOMContentLoaded", function () {
    var op1Input = document.getElementById("op1");
    var op2Input = document.getElementById("op2");
    var resultDisplay = document.getElementById("res");
    var contentDiv = document.getElementById("content");

    document.getElementById("add-button").addEventListener("click", function () {
        performCalculation("+");
    });

    document.getElementById("sub-button").addEventListener("click", function () {
        performCalculation("-");
    });

    document.getElementById("mul-button").addEventListener("click", function () {
        performCalculation("*");
    });

    document.getElementById("div-button").addEventListener("click", function () {
        performCalculation("/");
    });

    document.getElementById("log-button").addEventListener("click", function () {
        sendAjaxRequest("data/log.json", "GET", function (response) {
            contentDiv.innerHTML = `<h3>${response.name}</h3>
                        <p>${response.description}</p>
                        <img src="${response.image_name}" alt="${operation.toUpperCase()} Image">`;

// Додайте вивід фото у вашому результаті
resultDisplay.innerHTML = `<img src="${response.image_name}" alt="${operation.toUpperCase()} Image">`;


            var operand1 = parseFloat(op1Input.value);
            if (isNaN(operand1) || operand1 <= 0) {
                resultDisplay.textContent = "Invalid input for logarithm";
                return;
            }

            var result = Math.log(operand1);
            resultDisplay.textContent = "Result: " + result;
        });
    });

    document.getElementById("sin-button").addEventListener("click", function () {
        performTrigonometricOperation("sin");
    });

    document.getElementById("tan-button").addEventListener("click", function () {
        performTrigonometricOperation("tan");
    });

    function performCalculation(operator) {
        var operand1 = parseFloat(op1Input.value);
        var operand2 = parseFloat(op2Input.value);

        if (isNaN(operand1) || isNaN(operand2)) {
            resultDisplay.textContent = "Invalid input";
            return;
        }

        var result;
        switch (operator) {
            case "+":
                result = operand1 + operand2;
                break;
            case "-":
                result = operand1 - operand2;
                break;
            case "*":
                result = operand1 * operand2;
                break;
            case "/":
                if (operand2 === 0) {
                    resultDisplay.textContent = "Division by zero is not allowed";
                    return;
                }
                result = operand1 / operand2;
                break;
            default:
                result = "Invalid operator";
        }

        resultDisplay.textContent = "Result: " + result;
    }

    function performTrigonometricOperation(operation) {
        sendAjaxRequest(`data/${operation}.json`, "GET", function (response) {
            contentDiv.innerHTML = `<h3>${response.name}</h3>
                                    <p>${response.description}</p>
                                    <img src="${response.image_name}" alt="${operation.toUpperCase()} Image">`;

            var operand1 = parseFloat(op1Input.value);
            var result;

            switch (operation) {
                case "sin":
                    result = Math.sin((operand1 * Math.PI) / 180);
                    break;
                case "tan":
                    result = Math.tan((operand1 * Math.PI) / 180);
                    result = result.toPrecision(15); // Обмеження кількості значущих цифр
                    break;
                default:
                    result = "Invalid operation";
            }

            resultDisplay.textContent = "Result: " + result;
        });
    }

    function sendAjaxRequest(url, method, successCallback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        var response = JSON.parse(xhr.responseText);
                        successCallback(response);
                    } catch (error) {
                        console.error("Error parsing JSON: " + error.message);
                    }
                }
            }
        };

        xhr.open(method, url, true);
        xhr.send();
    }
});
