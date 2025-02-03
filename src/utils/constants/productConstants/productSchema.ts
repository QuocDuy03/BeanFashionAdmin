import * as yup from 'yup';

const colorRegex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;

export const schema = yup.object().shape({
    name: yup.string().required('Please enter product name'),
    price: yup.number().required('Please enter product price').typeError('Price must be a number'),
    discount: yup.number().typeError('Discount must be a number').transform((value, originalValue) => originalValue === '' ? 0 : value).min(0, 'Discount must be a valid number'),
    description: yup.string().required('Please enter product description'),
    categoryType: yup.object({
        value: yup.string().required("Please select a category"),
      }),
    sizes: yup.array().min(1, "Please select a size").of(
        yup.string().required("Please select a size")
    ).required(),
    numberOfColor: yup.string().required('Please enter number of color').typeError('Number of color must be a number'),
    colors: yup.array().of(
        yup.string().matches(colorRegex, 'Invalid color code')
    ).test('unique-colors', 'Colors must be unique', 
        (value) => {
            if (!value || value.length === 0) return true;
            const uniqueColors = new Set(value);
            return uniqueColors.size === value.length;
        }).required(),
    colorNames: yup.array().of(
        yup.string().required("Please enter color name")
    ).required(),
    imgUrls: yup.array().of(
        yup.string().url("Invalid image").defined("Plase provide image").notOneOf([""], "Please provide image")
    ).required("Please provide image"),
    stocks: yup.array().of(
        yup.number().min(0, "Product stock must be valid").required("Please enter stock").typeError("Stock must be a number")
    ).required("Please enter stock"),
    stockAll: yup.number().min(0, "Product stock must be valid").typeError("Stock must be a number"),
});