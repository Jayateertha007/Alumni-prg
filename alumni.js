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

            // Display initial alumni list
            displayAlumni(jsonData);

            // Add event listener for real-time search suggestions
            document.getElementById('search-input').addEventListener('input', function() {
                const searchQuery = this.value.toLowerCase();
                const filteredAlumni = jsonData.filter(alumnus => {
                    return alumnus.Name.toLowerCase().includes(searchQuery) ||
                           alumnus.Company.toLowerCase().includes(searchQuery) ||
                           alumnus['Current Job Title'].toLowerCase().includes(searchQuery);
                });
                displayAlumni(filteredAlumni);
            });

            function displayAlumni(alumniData) {
                alumniList.innerHTML = ''; // Clear the list

                alumniData.forEach(alumnus => {
                    const alumniCard = document.createElement('div');
                    alumniCard.className = 'alumni-card';

                    let photoHtml = alumnus.Photo ? `<img src="./photos/${alumnus.Photo}" alt="${alumnus.Name}" class="alumni-photo">` : '';

                    alumniCard.innerHTML = `
                        ${photoHtml}
                        <div class="alumni-info">
                            <h3>${alumnus.Name}</h3>
                            <p>Graduation Year: ${alumnus['Graduation Year']}</p>
                            <p>Current Position: ${alumnus['Current Job Title']}</p>
                            <p>Company: ${alumnus.Company}</p>
                        </div>
                    `;

                    alumniCard.addEventListener('click', function() {
                        modal.style.display = 'block';
                        modalPhoto.innerHTML = photoHtml;
                        modalName.textContent = alumnus.Name;
                        modalGraduationYear.textContent = `Graduation Year: ${alumnus['Graduation Year']}`;
                        modalPosition.textContent = `Current Position: ${alumnus['Current Job Title']}`;
                        modalCompany.textContent = `Company: ${alumnus.Company}`;
                        modalLinkedIn.innerHTML = `<a href="${alumnus.LinkedIn_Profile}" target="_blank">LinkedIn Profile</a>`;
                        modalEmail.textContent = `Email: ${alumnus.Email || 'E-mail'}`;
                        modalBio.textContent = `Bio: ${alumnus.Bio || 'No bio available'}`;
                    });

                    alumniList.appendChild(alumniCard);
                });

                // Update alumni count
                document.getElementById('alumni-count').textContent = `Total Alumni: ${alumniData.length}`;
            }

            // Close modal
            closeModal.onclick = function() {
                modal.style.display = 'none';
            };

            // Close modal if clicked outside
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = 'none';
                }
            };
        })
        .catch(error => {
            console.error('Error:', error.message);
            const errorMessage = document.createElement('p');
            errorMessage.textContent = `An error occurred: ${error.message}`;
            document.body.appendChild(errorMessage);
        });
});




