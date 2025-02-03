import { Link } from 'react-router-dom'
import { Button as Btn } from 'primereact/button'
import { ProgressSpinner } from 'primereact/progressspinner'

type CustomButtonProps = {
  className?: string
  size?: 'small' | 'large'
  type?: 'success' | 'warning' | 'danger' | undefined
  htmlType?: 'button' | 'submit' | 'reset' | undefined
  to?: string
  shadow?: boolean
  onClick?: () => void
  loading?: boolean
  rounded?: boolean
  disabled?: boolean
  children?: React.ReactNode
}

export const Button: React.FC<CustomButtonProps> = ({
  className,
  size = 'small',
  type,
  htmlType,
  to,
  shadow = true,
  onClick,
  loading = false,
  rounded = false,
  disabled = false,
  children
}) => {
  const btnClassNames = ` flex items-center justify-center
  ${className}`
  const childrenClassNames = `
  ${loading && 'invisible'}
  `
  return to ? (
    <Link to={to}>
      <Btn
        type={htmlType}
        severity={type}
        disabled={loading ? loading : disabled}
        className={btnClassNames}
        onClick={onClick}
        raised={shadow}
        size={size}
        rounded={rounded}
      >
        {loading && <ProgressSpinner className='absolute w-5 h-5 ' />}
        <div className={childrenClassNames}>{children}</div>
      </Btn>
    </Link>
  ) : (
    <Btn
      type={htmlType}
      severity={type}
      disabled={loading ? loading : disabled}
      className={btnClassNames}
      onClick={onClick}
      raised={shadow}
      size={size}
      rounded={rounded}
    >
      {loading && <ProgressSpinner className='absolute w-5 h-5 ' />}
      <div className={childrenClassNames}>{children}</div>
    </Btn>
  )
}
