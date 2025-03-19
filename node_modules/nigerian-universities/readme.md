# Nigerian Universities

`nigerian-universities` is an npm package that provides a comprehensive list of universities in Nigeria, including their name, city, state, and logo. This package is useful for developers building applications that require information on Nigerian higher education institutions.

## Installation

You can install this package via npm:

```bash
npm install nigerian-universities
```

## Usage

After installation, you can easily import and use the package in your JavaScript or TypeScript projects.

### Example

```javascript
// Import the package
const universities = require('nigerian-universities');

// Retrieve the list of universities
const universityList = universities;

// Example: Display the first university's details
console.log(universityList[0]);

/* Output:
{
    name: 'University of Lagos',
    city: 'Lagos',
    state: 'Lagos',
    logo: 'https://example.com/logos/unilag.png'
}
*/
```
<!-- 
### API

The package provides the following methods:

- **`getAllUniversities()`**: Returns an array of all universities in Nigeria.

- **`getUniversitiesByState(stateName)`**: Returns an array of universities in the specified state.

```javascript
const universitiesInLagos = universities.getUniversitiesByState('Lagos');
console.log(universitiesInLagos);
```

- **`getUniversityByName(name)`**: Returns the university object that matches the specified name.

```javascript
const unilag = universities.getUniversityByName('University of Lagos');
console.log(unilag);
```
-->

## Data Structure

Each university object contains the following properties:

- **`name`**: The name of the university (e.g., `University of Lagos`).
- **`city`**: The city where the university is located (e.g., `Lagos`).
- **`state`**: The state where the university is located (e.g., `Lagos`).
- **`logo`**: A URL to the university's logo (e.g., `https://example.com/logos/unilag.png`).

<!--
## Contributing

Contributions are welcome! If you have any improvements or additional data to include, feel free to open an issue or submit a pull request.

### Steps to Contribute

1. Fork the repository.
2. Create a new branch: `git checkout -b my-new-feature`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin my-new-feature`.
5. Submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

Special thanks to all the contributors who helped to make this package better.
-->

## Contact

For any questions, please contact [devabdulganiyy@gmail.com](mailto:devabdulganiyy@gmail.com).

If you find this helpful, [Buy me coffee](https://pay.chippercash.com/pay/ASABWCDLGM)
