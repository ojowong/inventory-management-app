// app/page.js
'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { firestore } from '../firebase'; // Removed 'auth' import as it's commented out
import { collection, doc, getDocs, setDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';
// import { signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  // const [user, setUser] = useState(null);
  // const [loginModalOpen, setLoginModalOpen] = useState(false);
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [isSignUp, setIsSignUp] = useState(false);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(setUser);
  //   return () => unsubscribe(); // Clean up subscription on unmount
  // }, []);

  const updateInventory = async () => {
    // if (!user) return;

    const snapshot = query(
      collection(firestore, 'inventory')
      // where('userId', '==', user.uid)
    );
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item, category) => {
    // if (!user) return;

    const normalizedItem = item.toLowerCase();
    const docRef = doc(collection(firestore, 'inventory'), normalizedItem);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1, category });
    } else {
      await setDoc(docRef, { quantity: 1, category });
    }

    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // const handleLoginModalOpen = () => setLoginModalOpen(true);
  // const handleLoginModalClose = () => setLoginModalOpen(false);

  // const handleSignOut = async () => {
  //   try {
  //     await signOut(auth);
  //   } catch (error) {
  //     console.error('Sign out error:', error.message);
  //   }
  // };

  // const handleLogin = async () => {
  //   try {
  //     if (isSignUp) {
  //       await createUserWithEmailAndPassword(auth, email, password);
  //     } else {
  //       await signInWithEmailAndPassword(auth, email, password);
  //     }
  //     handleLoginModalClose();
  //   } catch (error) {
  //     console.error('Authentication error:', error.message);
  //     alert(`Error: ${error.message}`);
  //   }
  // };

  const filteredInventory = inventory
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(item => filterCategory === 'All' || item.category === filterCategory);

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      {/* Add Item Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="Vegetables">Vegetables</MenuItem>
                <MenuItem value="Fruits">Fruits</MenuItem>
                <MenuItem value="Dairy">Dairy</MenuItem>
                <MenuItem value="Meat">Meat</MenuItem>
                <MenuItem value="Grains">Grains</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName, category);
                setItemName('');
                setCategory('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Main Content */}
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <TextField
        id="search"
        label="Search Items"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ width: '800px', marginBottom: 2 }}
      />
      <FormControl variant="outlined" sx={{ width: '800px', marginBottom: 2 }}>
        <InputLabel>Filter by Category</InputLabel>
        <Select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          label="Filter by Category"
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Vegetables">Vegetables</MenuItem>
          <MenuItem value="Fruits">Fruits</MenuItem>
          <MenuItem value="Dairy">Dairy</MenuItem>
          <MenuItem value="Meat">Meat</MenuItem>
          <MenuItem value="Grains">Grains</MenuItem>
        </Select>
      </FormControl>
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
      {/* {user ? (
        <Button variant="outlined" onClick={handleSignOut}>Sign Out</Button>
      ) : (
        <Button variant="contained" onClick={handleLoginModalOpen}>Log In / Sign Up</Button>
      )} */}
    </Box>
  );
}
