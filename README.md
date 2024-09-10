<h2>Grocery List App - Mark Jordan</h2>

<p>
This project is a simple and responsive Grocery List App built using PHP, basic HTML, standard CSS, and JavaScript. The app includes authentication features such as login and registration forms, with a modal popup for successful actions in the dashboard.
</p>

<h2>Features</h2>
<ul>
    <li><strong>Responsive Design</strong>: Works well on both desktop and mobile devices.</li>
    <li><strong>Authentication</strong>: Includes login and registration forms.</li>
    <li><strong>Modal Popup</strong>: Displays a success message when the user updates their username, successfully adds, or re-edits a grocery list.</li>
    <li><strong>Grocery Item Management</strong>: Add, edit, and remove grocery items easily.</li>
    <li><s><strong>Search and Filter</strong></s>: Quickly find items in your grocery list. (Not implemented yet)</li>
</ul>

<h2>Technologies Used</h2>
<ul>
    <li><strong>PHP</strong>: Backend logic and form handling.</li>
    <li><strong>HTML</strong>: Structure of the application.</li>
    <li><strong>CSS</strong>: Styling for a clean and simple interface.</li>
    <li><strong>JavaScript</strong>: Form validation, modal handling, and interactivity.</li>
    <li><strong>MySQL</strong>: Database management. Learn more about MySQL <a href="https://www.mysql.com/" target="_blank">here</a>.</li>
</ul>

<h2>Installation</h2>
<p>
Before you begin, ensure that you have XAMPP installed. You can download it from the following link: <a href="https://www.apachefriends.org/download.html" target="_blank">Download XAMPP</a>.
</p>
<ol>
    <li><strong>Navigate to the XAMPP Directory</strong>:</li>
    <p>Go to <code>C:\xampp\htdocs\</code> in your file explorer.</p>
    <li><strong>Create a New Folder</strong>:</li>
    <p>Create a new folder and name it <code>Github</code>. The path should look like this: <code>C:\xampp\htdocs\Github</code>.</p>
    <li><strong>Open Git Bash</strong>:</li>
    <p>Right-click in any empty area of the <code>Github</code> folder, and if you have Git Bash installed, click on it to open.</p>
    <li><strong>Clone the Repository</strong>:</li>
    <p>In the Git Bash window, type the following command to clone the repository:</p>
    <pre><code>git clone https://github.com/markjordanugtongspc/grocerylist-app-wiz</code></pre>
    <li><strong>Change Directory</strong>:</li>
    <p>After cloning, navigate into the cloned folder by typing:</p>
    <pre><code>cd grocerylist-app-wiz</code></pre>
    <li><strong>Open the Project in Your Code Editor</strong>:</li>
    <p>If you have Visual Studio Code installed, type:</p>
    <pre><code>code .</code></pre>
    <p>If you use a different code editor (like Notepad++ or Sublime Text), open the cloned folder by navigating to <code>C:\xampp\htdocs\Github\grocerylist-app-wiz</code> in your preferred editor.</p>
    <li><strong>Install Dependencies</strong>: Ensure that your local server (like <a href="https://www.apachefriends.org/download.html" target="_blank">XAMPP</a>) is running.</li>
    <li><strong>Set Up Database</strong>:</li>
    <ol>
        <li>Download the SQL file from the following link: <a href="https://cdn.discordapp.com/attachments/796388805572558869/1283092931477245952/grocery_list_db.sql?ex=66e1bce9&is=66e06b69&hm=ee90ee30f930150a3290048f02b8f482cd5d045e65a5d84e58da11cff623f755" target="_blank">grocery_list_db.sql</a>.</li>
        <li>Open your web browser and go to <a href="http://localhost/phpmyadmin" target="_blank">phpMyAdmin</a>.</li>
        <li>Click on the <strong>Databases</strong> tab.</li>
        <li>In the "Create database" field, enter <code>grocery_list_db</code>.</li>
        <li>Click the <strong>Create</strong> button.</li>
        <li>Once the database is created, click on the newly created <strong>grocery_list_db</strong> in the list.</li>
        <li>Click on the <strong>Import</strong> tab.</li>
        <li>Click <strong>Choose File</strong> and select the downloaded SQL file.</li>
        <li>Scroll down and click the <strong>Go</strong> button to import the database.</li>
    </ol>
    <li><strong>Configure Environment</strong>: Edit the configuration file to set your database credentials.</li>
    <li><strong>Run the Application</strong>: Access the app via your web browser at <code>http://localhost/Github/grocerylist-app-wiz/index.php</code>.</li>
</ol>

<h2>Usage</h2>
<p>
Once the application is set up, you can register a new account or log in if you already have one. After logging in, you will be able to add, edit, and remove items from your grocery list. You will receive a success message when you update your username, successfully add, or re-edit a grocery list.
</p>
