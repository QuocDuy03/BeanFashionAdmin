import { FaArrowDownLong, FaArrowUpLong, FaGear, FaRegUser } from 'react-icons/fa6'
import { IoHomeOutline, IoSearch, IoWarningOutline, IoCreateOutline } from 'react-icons/io5'
import { RxSlash } from 'react-icons/rx'
import { FaPlus, FaRegTrashAlt, FaUser, FaFilter, FaSortAmountDown, FaTrashRestore } from 'react-icons/fa'
import { CgDanger } from 'react-icons/cg'
import { HiOutlinePencilSquare } from 'react-icons/hi2'
import { LuSearch } from 'react-icons/lu'
import { IoMdClose, IoIosList, IoIosColorWand, IoIosClose } from 'react-icons/io'
import { RiDeleteBin6Line, RiDiscountPercentLine } from 'react-icons/ri'
import { FiLogOut, FiBox, FiDollarSign, FiPercent, FiTag, FiLayers, FiGrid, FiBookOpen } from 'react-icons/fi'
import { CiViewList } from 'react-icons/ci'
import {
  MdMenu,
  MdOutlineWatchLater,
  MdOutlineProductionQuantityLimits,
  MdOutlineReceiptLong,
  MdOutlineInventory2,
  MdOutlineImage
} from 'react-icons/md'
import { BiCategory } from "react-icons/bi";

export const icons = {
  menu: <MdMenu />,
  slash: <RxSlash />,
  home: <IoHomeOutline />,
  search: <IoSearch />,
  setting: <FaGear />,
  user: <FaRegUser />,
  add: <FaPlus />,
  delete: <FaRegTrashAlt />,
  danger: <CgDanger size={25} />,
  update: <HiOutlinePencilSquare />,
  faUser: <FaUser />,
  watch: <MdOutlineWatchLater />,
  sort: <FaSortAmountDown />,
  close: <IoIosClose />,
  searchProduct: <LuSearch size={18} color='gray' />,
  closePopup: <IoMdClose />,
  deleteProduct: <RiDeleteBin6Line color='red' />,
  filter: <FaFilter size={13} />,
  logout: <FiLogOut />,
  product: <MdOutlineProductionQuantityLimits />,
  productName: <FiBox />,
  productPrice: <FiDollarSign />,
  productDiscount: <FiPercent />,
  productCategory: <FiTag />,
  productSize: <FiLayers />,
  numberOfColor: <FiGrid />,
  productDescription: <FiBookOpen />,
  productColor: <IoIosColorWand />,
  productStock: <MdOutlineInventory2 />,
  productImage: <MdOutlineImage />,
  create: <IoCreateOutline />,
  blogList: <CiViewList />,
  list: <IoIosList />,
  orders: <MdOutlineReceiptLong />,
  downArrow: <FaArrowDownLong />,
  upArrow: <FaArrowUpLong />,
  warning: <IoWarningOutline />,
  restore: <FaTrashRestore />,
  category: <BiCategory />,
  discount: <RiDiscountPercentLine />,
}
