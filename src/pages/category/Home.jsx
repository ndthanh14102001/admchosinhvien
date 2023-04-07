import { useState, useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Box } from '@mui/system'
import Pagination from '@mui/material/Pagination'
import InputBase from '@mui/material/InputBase'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

// Icon import
import SearchIcon from '@mui/icons-material/Search'
import ConstructionIcon from '@mui/icons-material/Construction'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AddCategoryModal from './AddCategoryModal'
import DeleteCategoryModal from './DeleteCategoryModal'
import UpdateCategoryModal from './UpdateCategoryModal'

export default function category() {
  const [customer, setCustomer] = useState([])
  const [elementNum, setElementNum] = useState([])
  const [selectedPage, setSelectedPage] = useState('')
  const [change, setChange] = useState(true)

  const handleGetPage = (event, elementNum) => {
    setSelectedPage(elementNum)
  }

  const [searchedKey, setSearchedKey] = useState('')

  const handleGetSearch = (e) => {
    setSearchedKey(e.target.value)
  }

  // Using for Modal Add category
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false)
  const handleOpenAddCategoryModal = () => setOpenAddCategoryModal(true)
  const handleCloseAddCategoryModal = () => setOpenAddCategoryModal(false)

  // Using for Dialog delete category
  const [categoryDeleteData, setCategoryDeleteData] = useState({
    id: '',
    name: '',
  })
  const [openDeleteCategoryModal, setOpenDeleteCategoryModal] = useState(false)
  const handleOpenDeleteCategoryModal = (data) => {
    setOpenDeleteCategoryModal(true)
    setCategoryDeleteData({ id: data.id, name: data.attributes.name })
  }

  const handleCloseDeleteCategoryModal = () => setOpenDeleteCategoryModal(false)

  // Using for Dialog update category
  const [categoryUpdateData, setCategoryUpdateData] = useState({
    id: '',
    name: '',
    description: '',
    parent: '',
  })
  const [openUpdateCategoryModal, setOpenUpdateCategoryModal] = useState(false)
  const handleOpenUpdateCategoryModal = (id, name, description, parent) => {
    // console.log(data)
    const data = {
      id: id,
      name: name,
      description: description,
      parent: parent,
    }
    setOpenUpdateCategoryModal(true)
    setCategoryUpdateData(data)
  }

  const handleCloseUpdateCategoryModal = () => setOpenUpdateCategoryModal(false)

  const handleRefreshBoard = (deletedID) => {
    setCustomer(customer.filter((item) => item.id !== deletedID))
    setChange(!change)
    handleCloseDeleteCategoryModal()
    console.log(deletedID)
  }

  //const [open, setOpen] = useState(false);

  useEffect(() => {
    const requestUrl =
      process.env.REACT_APP_API_ENDPOINT +
      `/categories?populate=*&pagination[page]=${selectedPage}&pagination[pageSize]=7&filters[NAME][$contains]=${searchedKey}`
    fetch(requestUrl)
      .then((res) => res.json())
      .then((posts) => {
        setCustomer(posts.data)
      })
  }, [selectedPage, searchedKey, change])

  useEffect(() => {
    const requestUrl =
      process.env.REACT_APP_API_ENDPOINT +
      `/categories?filters[NAME][$contains]=${searchedKey}`
    fetch(requestUrl)
      .then((res) => res.json())
      .then((posts) => {
        setElementNum(posts.data)
      })
  }, [searchedKey])

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        // padding: '20px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', margin: '10px' }}>
        <Box>
          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: '300px',
            }}
          >
            <IconButton sx={{ p: '10px' }} aria-label="menu">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              value={searchedKey}
              onChange={handleGetSearch}
              placeholder="Tìm kiếm theo tên, mã danh mục"
              inputProps={{ 'aria-label': 'search google maps' }}
            />
          </Paper>
        </Box>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', margin: '0 10px' }}
        >
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={handleOpenAddCategoryModal}
          >
            Thêm danh mục
          </Button>
          <AddCategoryModal
            open={openAddCategoryModal}
            onClose={handleCloseAddCategoryModal}
            categoryData={elementNum}
          />
          <UpdateCategoryModal
            open={openUpdateCategoryModal}
            onClose={handleCloseUpdateCategoryModal}
            categoryID={categoryUpdateData.id}
            categoryName={categoryUpdateData.name}
            categoryDescription={categoryUpdateData.description}
            categoryParent={categoryUpdateData.parent}
            categoryData={elementNum}
          />
          <DeleteCategoryModal
            open={openDeleteCategoryModal}
            onClose={handleCloseDeleteCategoryModal}
            categoryID={categoryDeleteData.id}
            categoryName={categoryDeleteData.name}
            onAfterDelete={handleRefreshBoard}
          />
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: 'white' }}>Mã danh mục</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Tên danh mục
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Mô tả
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Danh mục cha
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Danh mục con
              </TableCell>
              <TableCell sx={{ color: 'white' }} align="center">
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customer.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="center">
                  {row.id}
                </TableCell>
                <TableCell align="center">{row.attributes.name}</TableCell>
                <TableCell
                  align="right"
                  sx={{ color: row.attributes.description ? 'black' : 'grey' }}
                >
                  {row.attributes.description
                    ? row.attributes.description
                    : 'Chưa có'}
                </TableCell>
                <TableCell align="center">
                  {row.attributes.parent.data
                    ? row.attributes.parent.data.attributes.name
                    : 'Chưa có'}
                </TableCell>
                <TableCell align="center">
                  {row.attributes.children.data
                    ? row.attributes.children.data.map((row) => (
                        <Box key={row.id}>{row.attributes.name}</Box>
                      ))
                    : 'Chưa có'}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      handleOpenUpdateCategoryModal(
                        row.id,
                        row.attributes.name,
                        row.attributes.description,
                        row.attributes.parent.data
                          ? row.attributes.parent.data.id
                          : '',
                      )
                    }}
                  >
                    <ConstructionIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleOpenDeleteCategoryModal(row)}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box spacing={2} sx={{ padding: '20px' }}>
        <Pagination
          count={Math.ceil(elementNum.length / 7)}
          onChange={handleGetPage}
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  )
}