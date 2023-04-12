import {
    Box,
    Flex,
    Text,
    Stack,
    VStack,
    HStack,
    Input,
    InputGroup,
    InputAddon,
    InputLeftElement,
    InputRightElement,
    Button,
    FormControl,
    FormHelperText,
    useToast,
    useNumberInput,
    useDisclosure,
    Image
} from '@chakra-ui/react'
import {
    AddIcon,
    MinusIcon
} from '@chakra-ui/icons';
import { IoAdd } from 'react-icons/io'
import { HiOutlineMinus } from 'react-icons/hi'
import { BsCartPlus } from 'react-icons/bs'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { addProductToCart } from '../../Reducers/cartSlice';
import CarouselProduct from '../../Components/CarouselProduct';

function ProductDetailUser() {

    // state function
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState([]);
    const [productStock, setProductStock] = useState([]);
    const [productImg, setProductImg] = useState([]);
    const [quantity, setQuantity] = useState(null);

    // redux toolkit
    const authSelector = useSelector((state) => state.authUserReducer)
    const cartSelector = useSelector((state) => state.cartSlice)
    const dispatch = useDispatch()

    // react router
    const params = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    // toast from chakra
    const toast = useToast()

    // alert
    const { isOpen, onOpen, onClose } = useDisclosure()

    // fetch product data
    const getProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/product/${params.id}`)

            setProducts(response.data.data)
            setProductId(response.data.id)
            setProductImg(response.data.image)

            const stockProduct = response.data.stockBranch.map((val) => {
                return val.stock
            })
            let total = 0
            for (let i = 0; i < stockProduct.length; i++) {
                total += Number(stockProduct[i])
            }
            setProductStock(total);

        } catch (error) {
            console.log(error)
        }
    }

    // add to cart
    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
        useNumberInput({
            step: 1,
            defaultValue: 1,
            min: 1,
            max: productStock,
        })

    const plus = getIncrementButtonProps()
    const minus = getDecrementButtonProps()
    const input = getInputProps()
    const qty = Number(input.value)

    const addToCart = async () => {
        try {
            let addToCart = {
                productId: productId,
                quantity: qty,
            }
            const response = await axios.post("http://localhost:5000/api/cart/add", addToCart)

            dispatch(addProductToCart(response.data))

            toast({
                title: "Added",
                status: "success",
                duration: 1000,
            })

        } catch (err) {
            console.log(err)
            toast({
                title: "Error",
                status: "error",
                duration: 1000,
                description: err.response.data.message,
            })
        }
    }

    // rupiah converter function 
    const rupiah = (value) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);
    };
    // validate user
    const validateUser = () => {
        if (!authSelector.id) {
          onOpen()
        }
      }
      const navigateLogin = () => {
        onClose()
      }

    // rendering 
    useEffect(() => {
        getProduct()
    }, [qty, quantity, products])

    return (
        <>
            <Box
                width={'7xl'}
                mx={'auto'}
            >
                {/* headers */}
                {/* <Flex
                    as='headers'
                    bgColor={'#F6F6F6'}
                    my={8}
                    justify={'center'}
                    align={'center'}
                    height={'10'}
                >

                    <Text
                        color={'blackAlpha.700'}
                        fontFamily={''}
                        fontWeight={'bold'}
                        fontSize={'16px'}
                    >
                        Category
                    </Text>
                </Flex> */}

                {/* product detail */}
                <Flex
                    flex={'5'}
                    h={'xl'}
                    mt={'4'}
                >
                    <Box
                        flex={'2'}
                        border={'2px'}
                        borderColor={'gray.100'}
                        boxShadow={'md'}
                    >
                        <Stack>
                            <Box
                                // p={'4'}
                                // m={'auto'}
                                // h='75%'
                                // // boxShadow={'lg'}
                                // mt={'2'}
                                // w='95%'
                            >
                                {/* image */}
                                <Box>
                                    <Image src='' alt='product image' />
                                </Box>
                            </Box>
                            <Box>
                                {/* loop image column */}
                            </Box>
                        </Stack>
                    </Box>
                    <Box
                        flex={'3'}
                        border={'2px'}
                        borderColor={'gray.100'}
                        ml={'4'}
                        h='75%'
                    >
                        <Stack>

                            {/* product name */}
                            <Text
                                fontSize={'3xl'}
                                fontWeight={'bold'}
                                py={'4'}
                                pl={'8'}
                                color={'blackAlpha.800'}
                            >
                                Product Name
                                {products.name}
                            </Text>
                            {/* availablity (stock) */}
                            <Text
                                fontSize={'sm'}
                                pl={'8'}
                            >
                                Availablity in stock: {productStock}
                            </Text>
                            {/* Product Code */}
                            <Text
                                fontSize={'sm'}
                                pl={'8'}
                            >
                                Product Code:
                            </Text>
                        </Stack>
                        {/* price */}
                        <Text
                            fontSize={'3xl'}
                            pl={'8'}
                            fontWeight={'bold'}
                            mt={'12'}
                            color={'blackAlpha.700'}
                        >
                            {/* Rp.20.000 */}
                            {rupiah(products.price)}
                        </Text>
                        {/* quantity decrement increment */}
                        <HStack
                            mt={'12'}
                        >
                            <Text
                                fontSize={'sm'}
                                px={'4'}
                                pl={'8'}
                            >
                                Quantity:
                            </Text>
                            <HStack alignSelf="center" maxW="320px">
                                <InputGroup>
                                    <InputLeftElement>
                                        <Button variant="unstyled">
                                            <MinusIcon
                                                {...minus}
                                                color={qty > 1 ? "#0095DA" : "#c0cada"}
                                            />
                                        </Button>

                                    </InputLeftElement>
                                    <Input
                                        width="10em"
                                        textAlign="center"
                                        {...input}
                                        _hover={"none"}
                                        isDisabled={productStock === 0 ? true : false}
                                    />
                                    <InputRightElement>
                                        <Button
                                            isDisabled={productStock <= qty}
                                            {...plus}
                                            variant="unstyled"
                                        >
                                            <AddIcon
                                                color={productStock <= qty ? "#c0cada" : "#0095DA"}
                                            />
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </HStack>
                        </HStack>
                        {/* add to cart */}
                        <HStack>
                            <Button
                                color="white"
                                bg="#6FA66F"
                                size="md"
                                w='90%'
                                mt="8"
                                mx='auto'
                                p="4"
                                rounded='none'
                                _hover={{ boxShadow: 'xl' }}
                                onClick={addToCart}
                            >
                                <BsCartPlus />
                                <Text ml={'4'}>
                                    ADD TO CART
                                </Text>
                            </Button>
                        </HStack>
                    </Box>

                </Flex>
                {/* description */}
                <Box>
                    <Box
                        mt={'8'}
                        bgColor={'#6FA66F'}
                        h={'12'}
                    >
                        <Text
                            color={'#F6F6F6'}
                            fontFamily={'heading'}
                            fontWeight={'bold'}
                            fontSize={'20px'}
                            // textAlign={'center'}
                            pt={'2'}
                            ml={'4'}
                        >
                            DESCRIPTION
                        </Text>
                    </Box>
                    <Box
                        height={'40'}
                        border={'2px'}
                        borderColor={'gray.100'}
                        p={'2'}
                    >
                        <Box
                            bgColor={'#F6F6F6'}
                            w='full'
                            m={'auto'}
                            h={'full'}
                            p={'12'}
                        >
                            {products.description}
                            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero aspernatur porro ducimus iste architecto expedita quis, nobis ab eligendi, modi, illum ut ipsum obcaecati optio. Doloremque voluptatem corrupti aperiam atque. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius, reprehenderit itaque odit sit ea aspernatur, incidunt minus dolorum deserunt mollitia commodi quis quae distinctio cum unde vel placeat amet nihil.
                        </Box>
                    </Box>
                </Box>

                {/* related product based on category */}
                <Box>
                    <Box
                        mt={'8'}
                        bgColor={'#6FA66F'}
                        h={'12'}
                    >
                        <Text
                            color={'#F6F6F6'}
                            fontFamily={'heading'}
                            fontWeight={'bold'}
                            fontSize={'20px'}
                            // textAlign={'center'}
                            pt={'2'}
                            ml={'4'}
                        >
                            RELATED PRODUCT
                        </Text>
                    </Box>
                    <Box
                        height={'40'}
                        border={'2px'}
                        borderColor={'gray.100'}
                        p={'2'}
                    >
                        <Box
                            bgColor={'#F6F6F6'}
                            w='full'
                            m={'auto'}
                            h={'full'}
                            p={'12'}
                        >
                            <CarouselProduct/>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default ProductDetailUser;