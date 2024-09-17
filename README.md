<h2>Grocery List App - Mark Jordan</h2>

<p>
This project is a comprehensive and responsive Grocery List App built using PHP, HTML, CSS, and JavaScript. The app includes advanced features such as authentication, dynamic product management, and an interactive shopping list modal.
</p>

<h2>Features</h2>
<ul>
    <li><strong>Responsive Design</strong>: Optimized for both desktop and mobile devices.</li>
    <li><strong>User Authentication</strong>: Secure login and registration system.</li>
    <li><strong>Dynamic Product Management</strong>: Add, edit, and remove products with ease.</li>
    <li><strong>Interactive Shopping List Modal</strong>: View and manage your shopping lists with a modern interface.</li>
    <li><strong>Price Calculation</strong>: Automatic calculation of total prices for shopping lists.</li>
    <li><strong>Purchase Tracking</strong>: Mark items as purchased with visual feedback.</li>
    <li><strong>Category Filtering</strong>: Organize and view products by categories.</li>
    <li><strong>Sorting Options</strong>: Sort products by various criteria like price and name.</li>
    <li><strong>User Settings</strong>: Personalize your account with profile picture uploads.</li>
    <li><strong>Modal Popup</strong>: Displays a success message when the user updates their username, successfully adds, or re-edits a grocery list.</li>
</ul>

<h2>Technologies Used</h2>
<ul>
    <li><strong>PHP</strong>: Backend logic and database interactions.</li>
    <li><strong>HTML5</strong>: Structure of the web application.</li>
    <li><strong>CSS3</strong>: Styling for a modern and responsive interface.</li>
    <li><strong>JavaScript</strong>: Dynamic content loading, form validation, and interactive features.</li>
    <li><strong>MySQL</strong>: Database management for storing user data and product information. Learn more about MySQL <a href="https://www.mysql.com/" target="_blank">here</a>.</li>
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
        <li>Download the SQL file from the following link: <a href="https://cdn.discordapp.com/attachments/796388805572558869/1285739331771695215/grocery_list_db.sql?ex=66eb5d90&is=66ea0c10&hm=885bc6fc7b66daacf6b5935eba077ff56c8264bf81db17e24169f840420f273c&" target="_blank">grocery_list_db.sql</a>.</li>
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

<h2>Contributing</h2>
<p>
Contributions to the Grocery List App are welcome! Please feel free to submit pull requests or open issues to suggest improvements or report bugs.
</p>

<h2>License</h2>
<p>
This project is open-source and available under the MIT License.
</p>
