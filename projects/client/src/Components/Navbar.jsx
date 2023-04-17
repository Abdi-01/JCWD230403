import React from 'react';
import { 
    Container,
    Flex,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Button,
    InputRightElement,
    InputGroup,
    Link,
    Text,
    Box,
    Divider,
    Heading
 } from '@chakra-ui/react';
import { AiOutlineMenu } from 'react-icons/ai';
import { GoSearch } from 'react-icons/go';
import { BsCart2 } from 'react-icons/bs';
import { AiFillHome } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutActionAdmin } from '../Reducers/authAdmin';
import { logoutActionUser } from '../Reducers/authUser';

function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const nameAdmin = useSelector((state) => state.authAdminReducer.name);
    const nameUser = useSelector((state) => state.authUserReducer.name);
    const name = nameAdmin || nameUser

    const roleIdAdmin = useSelector((state) => state.authAdminReducer.roleId);
    const roleIdUser = useSelector((state) => state.authUserReducer.roleId);
    const roleId = roleIdAdmin || roleIdUser

    const logoutBtn = () => {
        localStorage.removeItem('grocery_login');
        dispatch(logoutActionAdmin());
        dispatch(logoutActionUser());
    }
    

    return ( 
    <Container maxW={'full'} px={{base:'2', sm:'6', md:'25px', lg:'35px'}} bgGradient='linear(to-b, green.500, green.400)'>
        <Flex py={'2'} alignItems={'Center'} justifyContent={'space-between'}>
            {/* <Link textDecoration={'none'} _hover={{ textDecoration: "none" }} fontSize={{base:'lg', md:'xl', lg:'3xl'}} fontWeight='semibold' color={'white'} onClick={() => navigate(roleId == 1 || roleId == 2 ? '/admin' : '/')}>FreshFinds</Link> */}
            {/* <Box fontSize={{base:'2xl', md:'3xl', lg:'4xl'}} p='1' color='white' onClick={() => navigate(roleId === 1 || roleId === 2 ? '/admin' : '/')}>
                <AiFillHome/>
            </Box> */}
            <Box fontSize={{base:'2xl', md:'3xl', lg:'4xl'}} p='1' color='white' onClick={() => navigate(roleId == 1 || roleId == 2 ? '/admin' : '/')}>
                {
                  roleId == 1 || roleId == 2 ? 
                  <Heading
                  fontSize={'2xl'}
                  >
                    FreshFinds
                  </Heading>
                  :
                  <AiFillHome/>
                }
            </Box>
            {/* {
                name ? 
                (roleId == 3 ?
                <Flex alignItems={'Center'} gap={{base:'1', sm:'1', md:'5', lg:'5'}} justifyContent='space-between' width={{md:'md', lg:'6xl'}} px={{base:'1', sm:'2', md:'10', lg:'10'}}>
                    <InputGroup size={'md'}>
                        <Input pr={'2.75rem'}  placeholder='search' size="sm" type={'search'} rounded={'lg'} backgroundColor={'white'}/>
                        <InputRightElement h={'2rem'}>
                            <Button borderLeftRadius={'0'} h={'2rem'} size={'sm'}>
                                <GoSearch size={'sm'}/>
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                    <Link variant={'outline'} backgroundColor={'transparent'} border={'none'} color={'white'} fontSize={{base:'xl', md:'xl', lg:'2xl'}} p='1' mx='0'>
                        <BsCart2/>
                    </Link>
                </Flex>
                :
                null)
                :
                <Flex alignItems={'Center'} gap={{base:'1', sm:'1', md:'5', lg:'5'}} justifyContent='space-between' width={{md:'md', lg:'2xl'}} pl={{base:'2',lg:'16'}}>
                    <InputGroup size={'md'}>
                        <Input pr={'2.75rem'}  placeholder='search' size="sm" type={'search'} rounded={'lg'} backgroundColor={'white'}/>
                        <InputRightElement h={'2rem'}>
                            <Button borderLeftRadius={'0'} h={'2rem'} size={'sm'}>
                                <GoSearch size={'sm'}/>
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                    <Link variant={'outline'} backgroundColor={'transparent'} border={'none'} color={'white'} fontSize={{base:'xl', md:'xl', lg:'2xl'}} p='1' mx='3'>
                        <BsCart2/>
                    </Link>
                </Flex>
            } */}
            {
                name ? 
                <Flex alignItems={'Center'} gap={'1'}>
                    <Flex
                    display={['none', 'none','flex', 'flex']} alignItems={'center'} ml='1'
                    >
                        <Menu>
                          <MenuButton>
                            <Text color='white' p={'1'} fontSize='2xl' fontWeight={'semibold'}>{name}</Text>
                          </MenuButton>
                          <MenuList>
                            {
                                roleId === 3 ?
                                <MenuItem type='button' onClick={() => {navigate('/change')}}>Change Password</MenuItem>
                                :
                                null
                            }
                            <MenuItem type='button' onClick={() => {logoutBtn(); {navigate('/login', { replace:true})}}}>Logout</MenuItem>
                          </MenuList>
                        </Menu>
                    </Flex>
                    <Flex display={['flex', 'flex', 'none', 'none']} alignItems={'center'} ml='1'>
                        <Menu>
                          <MenuButton>
                            <Text color='white' p={'1'} fontSize='xl' fontWeight={'semibold'}>{name}</Text>
                          </MenuButton>
                          <MenuList>
                            {
                                roleId === 3 ?
                                <MenuItem type='button' onClick={() => {navigate('/change')}}>Change Password</MenuItem>
                                :
                                null
                            }
                            <MenuItem type='button' onClick={() => {logoutBtn(); {navigate('/login', { replace:true})}}}>Logout</MenuItem>
                          </MenuList>
                        </Menu>
                    </Flex>
                </Flex>
                :
                <Flex alignItems={'Center'} gap={'1'}>
                    <Flex
                    display={['none', 'none','flex', 'flex']} alignItems={'center'}
                    w='auto'
                    >
                        <Link p={'1'} mr='2' textDecoration={'none'} _hover={{ textDecoration: "none", rounded:'lg' }} fontSize={{base:'xl', md:'xl', lg:'2xl'}} fontWeight='semibold' color={'white'} onClick={() => navigate('/register')}>SignUp</Link>
                        <Divider height="20px" colorScheme='whiteAlpha' orientation='vertical' />
                        <Link p={'1'} textDecoration={'none'} _hover={{ textDecoration: "none", rounded:'lg' }} fontSize={{base:'xl', md:'xl', lg:'2xl'}} fontWeight='semibold' color={'white'} onClick={() => navigate('/login')}>Login</Link>
                    </Flex>
                    <Flex display={['flex', 'flex', 'none', 'none']} alignItems={'center'} gap={'1'}>
                        <Menu>
                            <MenuButton as={Button} variant={'outline'} rounded={'lg'} size={'sm'} color={'green.400'} backgroundColor={'white'}>
                              <AiOutlineMenu/>
                            </MenuButton>
                            <MenuList>
                              <MenuItem type='button' onClick={() => navigate('/register')}>Sign Up</MenuItem>
                              <MenuItem type='button' onClick={() => navigate('/login')}>Login</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                </Flex>
            }
        </Flex>
    </Container> );
}

export default Navbar;