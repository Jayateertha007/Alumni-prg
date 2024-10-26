document.addEventListener('DOMContentLoaded', function() {
    fetch('Alumni_data.xlsx')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.arrayBuffer();
        })
        .then(data => {
            let workbook;
            try {
                workbook = XLSX.read(new Uint8Array(data), { type: 'array' });
            } catch (error) {
                throw new Error(`Error reading the Excel file: ${error.message}`);
            }
            
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            let jsonData;
            try {
                jsonData = XLSX.utils.sheet_to_json(worksheet);
            } catch (error) {
                throw new Error(`Error converting Excel sheet to JSON: ${error.message}`);
            }

            const alumniList = document.getElementById('alumni-list');
            const modal = document.getElementById('alumni-modal');
            const modalPhoto = document.getElementById('modal-alumni-photo');
            const modalName = document.getElementById('modal-alumni-name');
            const modalGraduationYear = document.getElementById('modal-graduation-year');
            const modalPosition = document.getElementById('modal-position');
            const modalCompany = document.getElementById('modal-company');
            const modalLinkedIn = document.getElementById('modal-linkedin');
            const modalBio = document.getElementById('modal-bio');
            const closeModal = document.querySelector('.close');

            if (!alumniList) {
                throw new Error(`Alumni list element not found`);
            }

            jsonData.forEach(alumnus => {
                const alumniCard = document.createElement('div');
                alumniCard.className = 'alumni-card';
                // jay
                let photoHtml = '';
                if (alumnus.Photo) {
                    photoHtml = `<img src="./photos/${alumnus.Photo}" alt="${alumnus.Name}" class="alumni-photo">`;
                }
                let Chat = '';
                Chat = ``;

                alumniCard.innerHTML = `
                    ${photoHtml} 
                    
                    <div class="alumni-info">
                        <h3>${alumnus.Name}</h3>
                        <p>Graduation Year: ${alumnus['Graduation Year']}</p>
                        <p>Current Position: ${alumnus['Current Position']}</p>
                        <p>Company: ${alumnus.Company}</p>
                    </div>
                    <img src="./photos/chat.png" class="alumni-chat">
                `;
                
            
                alumniList.appendChild(alumniCard);
            });

            // Add alumni count
            const countElement = document.getElementById('alumni-count');
            if (!countElement) {
                throw new Error(`Alumni count element not found`);
            }
            countElement.textContent = `Total Alumni: ${jsonData.length}`;

            // Close modal
            closeModal.onclick = function() {
                modal.style.display = 'none';
            }

            // Close modal if clicked outside
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            }
        })
        .catch(error => {
            console.error('Error:', error.message);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = `An error occurred: ${error.message}`;
            document.body.appendChild(errorMessage);
        });
});
