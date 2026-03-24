import { useState, useRef, useEffect } from 'react'
import { IconGridDots } from '@tabler/icons-react'

interface Product {
  id: string
  name: string
  description: string
  icon: string // Image path
  badge?: string
}

interface ProductSwitcherProps {
  products: Product[]
  currentProductId: string
  currentProductIcon?: string
  onProductSelect: (productId: string) => void
  isCollapsed?: boolean
}

/**
 * ProductSwitcher Component
 */
export function ProductSwitcher({
  products,
  currentProductId,
  currentProductIcon,
  onProductSelect,
  isCollapsed = false,
}: ProductSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {isCollapsed ? (
        // Collapsed state - show product icon with bracket
        <button
          className="product-switcher-collapsed-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          {currentProductIcon ? (
            <img 
              src={currentProductIcon} 
              alt="Product"
              style={{ width: '28px', height: '28px', objectFit: 'contain' }}
            />
          ) : (
            <IconGridDots size={20} stroke={1.5} />
          )}
          <span className="sidebar-bracket-indicator">┘</span>
        </button>
      ) : (
        // Expanded state - show grid dots button
        <button
          className="product-switcher-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          <IconGridDots size={20} stroke={1.5} />
        </button>
      )}

      {isOpen && (() => {
        const currentProduct = products.find(p => p.id === currentProductId)
        return (
          <div className="product-dropdown">
            {/* Current product header with dark background */}
            <div className="product-dropdown-current">
              {currentProduct && (
                <>
                  <img 
                    src={currentProduct.icon} 
                    alt={currentProduct.name}
                    className="product-dropdown-current-icon"
                  />
                  <span className="product-dropdown-current-name">
                    {currentProduct.name.replace('Whatfix ', '')}
                  </span>
                </>
              )}
            </div>

            {/* Switch to section */}
            <div className="product-dropdown-header">Switch to</div>

            <div style={{ paddingBottom: '8px' }}>
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    onProductSelect(product.id)
                    setIsOpen(false)
                  }}
                  className={`product-dropdown-item ${product.id === currentProductId ? 'active' : ''}`}
                >
                  <div className="product-dropdown-icon">
                    <img 
                      src={product.icon} 
                      alt={product.name}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="product-dropdown-name">{product.name}</div>
                    <div className="product-dropdown-desc">{product.description}</div>
                  </div>
                  {product.badge && (
                    <span className="product-dropdown-badge">{product.badge}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
