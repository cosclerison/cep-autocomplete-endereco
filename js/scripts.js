const addressForm = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const neighborhoodInput = document.querySelector("#neighborhood");
const regionInput = document.querySelector("#region");

// seleciona todos os data-input, para desabilitar no momento certo
const formInputs = document.querySelectorAll("[data-input]")

const closeButton = document.querySelector("#close-message")

// Validar CEP input, apenas numeros
cepInput.addEventListener("keypress", (e) => {
  const onlyNumbers = /[0-9]/;
  const key = String.fromCharCode(e.keyCode);

  // somente números
  if(!onlyNumbers.test(key)) {
    e.preventDefault();
    return;
  }
});


// Evento to get address
cepInput.addEventListener("keyup", (e) => {
  const inputValue = e.target.value;

  //   Verificar se possui todos os números do CEP
  if (inputValue.length === 8) {
    getAddress(inputValue);
  }
});

// Buscar o CEP na API
const getAddress = async (cep) => {
  toggleLoader();

  cepInput.blur();

  const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;

  const response = await fetch(apiUrl);

  const data = await response.json();

  console.log(data);
  console.log(formInputs);
  console.log(data.erro);

  // Shw erro e limpar form
  if (data.erro === "true") {
    if (!addressInput.hasAttribute("disabled")) {
      toggleDisabled();
    }

    addressForm.reset();
    toggleLoader();
    toggleMessage("CEP Inválido, tente novamente.");
    return;
  }

  // Activate disabled attribute if form is empty
  if (addressInput.value === "") {
    toggleDisabled();
  }

  addressInput.value = data.logradouro;
  cityInput.value = data.localidade;
  neighborhoodInput.value = data.bairro;
  regionInput.value = data.uf;

  toggleLoader();
};

// Add or remove disable attribute
const toggleDisabled = () => {
  if (regionInput.hasAttribute("disabled")) {
    formInputs.forEach((input) => {
      input.removeAttribute("disabled");
    });
  } else {
    formInputs.forEach((input) => {
      input.setAttribute("disabled", "disabled");
    });
  }
};

// Show or hide loader
const toggleLoader = () => {
  const fadeElement = document.querySelector("#fade");
  const loaderElement = document.querySelector("#loader");

  fadeElement.classList.toggle("hide");
  loaderElement.classList.toggle("hide");
};

// Show or hide message
const toggleMessage = (msg) => {
  const fadeElement = document.querySelector("#fade");
  const messageElement = document.querySelector("#message");

  const messageTextElement = document.querySelector("#message p");

  messageTextElement.innerText = msg;

  fadeElement.classList.toggle("hide");
  messageElement.classList.toggle("hide");
};

// Close message modal
closeButton.addEventListener("click", () => toggleMessage());

// Save address
addressForm.addEventListener("submit", (e) => {
  e.preventDefault();

  toggleLoader();

  setTimeout(() => {
    toggleLoader();

    toggleMessage("Endereço salvo com sucesso!");

    addressForm.reset();

    toggleDisabled();
  }, 1000);
});
