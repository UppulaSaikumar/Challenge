document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#chemicalTable tbody");
    const addButton = document.querySelector("#addButton");
    const deleteButton = document.querySelector("#deleteButton");
    const refreshButton = document.querySelector("#refreshButton");
    const headers = document.querySelectorAll("#chemicalTable th[data-column]");
  
    let chemicalData = [];
  
    // Fetch data from localStorage or default data
function fetchData() {
    return fetch('./data/chemicals.json')
        .then(response => response.json())
        .catch(() => JSON.parse(localStorage.getItem("chemicalData")) || []);
}

// Load data initially
fetchData().then(data => {
    chemicalData = data;
    renderTableRows();
});
  
    // Render table rows
    function renderTableRows() {
      tableBody.innerHTML = ""; // Clear table first
      chemicalData.forEach((chemical, index) => {
        const row = `
          <tr>
            <td><input type="checkbox" class="editCheckbox" data-index="${index}"></td>
            <td>${chemical.id}</td>
            <td contenteditable="true" class="editable">${chemical.chemicalName}</td>
            <td contenteditable="true" class="editable">${chemical.vendor}</td>
            <td contenteditable="true" class="editable">${chemical.density}</td>
            <td contenteditable="true" class="editable">${chemical.viscosity}</td>
            <td contenteditable="true" class="editable">${chemical.packaging}</td>
            <td contenteditable="true" class="editable">${chemical.packSize}</td>
            <td contenteditable="true" class="editable">${chemical.unit}</td>
            <td contenteditable="true" class="editable">${chemical.quantity}</td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    }
    // Save chemical data to localStorage
function saveToLocalStorage() {
    localStorage.setItem("chemicalData", JSON.stringify(chemicalData));
}

    // Add Chemical Button functionality
addButton.addEventListener("click", function () {
    const chemicalName = prompt("Enter Chemical Name:");
    const vendor = prompt("Enter Vendor:");
    const density = prompt("Enter Density (g/m³):");
    const viscosity = prompt("Enter Viscosity (m²/s):");
    const packaging = prompt("Enter Packaging Type:");
    const packSize = prompt("Enter Pack Size:");
    const unit = prompt("Enter Unit (kg, L, etc.):");
    const quantity = prompt("Enter Quantity:");

    if (
        chemicalName &&
        vendor &&
        density &&
        viscosity &&
        packaging &&
        packSize &&
        unit &&
        quantity
    ) {
        // Check for duplicates by chemical name
        const exists = chemicalData.some(
            (chemical) => chemical.chemicalName === chemicalName
        );
        if (exists) {
            alert("This chemical already exists.");
            return;
        }

        const newChemical = {
            id: chemicalData.length
                ? Math.max(...chemicalData.map((c) => c.id)) + 1
                : 1,
            chemicalName: chemicalName,
            vendor: vendor,
            density: parseFloat(density),
            viscosity: parseFloat(viscosity),
            packaging: packaging,
            packSize: parseFloat(packSize),
            unit: unit,
            quantity: parseFloat(quantity),
        };

        chemicalData.push(newChemical);
        saveToLocalStorage(); // Save to localStorage
        renderTableRows();
    } else {
        alert("Please provide valid inputs for all fields.");
    }
});

  
    // Delete Chemical Button functionality
    deleteButton.addEventListener("click", function () {
      const checkboxes = document.querySelectorAll(".editCheckbox:checked");
      const indexesToDelete = Array.from(checkboxes).map((cb) =>
        parseInt(cb.getAttribute("data-index"))
      );
  
      // Delete in reverse order to avoid indexing issues
      indexesToDelete
        .sort((a, b) => b - a)
        .forEach((index) => {
          chemicalData.splice(index, 1); // Remove selected chemical
        });
  
      saveToLocalStorage(); // Save to localStorage
      renderTableRows(); // Re-render table after deletion
    });
  
    // Save (Refresh) Button functionality
    refreshButton.addEventListener("click", function () {
      const checkboxes = document.querySelectorAll(".editCheckbox:checked");
      checkboxes.forEach((cb) => {
        const index = parseInt(cb.getAttribute("data-index"));
        const row = cb.closest("tr");
        const editableCells = row.querySelectorAll(".editable");
        
        // Update the chemicalData array with edited values
        chemicalData[index] = {
          ...chemicalData[index],
          chemicalName: editableCells[0].innerText,
          vendor: editableCells[1].innerText,
          density: parseFloat(editableCells[2].innerText),
          viscosity: parseFloat(editableCells[3].innerText),
          packaging: editableCells[4].innerText,
          packSize: parseFloat(editableCells[5].innerText),
          unit: editableCells[6].innerText,
          quantity: parseFloat(editableCells[7].innerText),
        };
      });
  
      saveToLocalStorage(); // Save to localStorage
      alert("Changes have been saved!");
    });
  
    // Sorting functionality
    headers.forEach(header => {
      header.addEventListener("click", () => {
        const column = header.getAttribute("data-column");
        const order = header.getAttribute("data-order") === "asc" ? "desc" : "asc";
        header.setAttribute("data-order", order);
  
        chemicalData.sort((a, b) => {
          if (order === "asc") {
            return a[column] < b[column] ? -1 : 1;
          } else {
            return a[column] > b[column] ? -1 : 1;
          }
        });
  
        renderTableRows(); // Re-render sorted table
      });
    });
  });
  