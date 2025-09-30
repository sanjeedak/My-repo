import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button'; 

const CartPage = () => {
  const { cartItems, updateQuantity, removeItems, prepareForCheckout, loading, clearCart } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    setSelectedItems(prevSelected => {
      const currentCartIds = new Set(cartItems.map(item => item.id));
      const newSelected = new Set();
      prevSelected.forEach(id => {
        if (currentCartIds.has(id)) {
          newSelected.add(id);
        }
      });
      return newSelected;
    });
  }, [cartItems]);

  const selectedItemsData = useMemo(() =>
    cartItems.filter(item => selectedItems.has(item.id)),
    [cartItems, selectedItems]
  );

  const itemsToCheckout = useMemo(() =>
    selectedItemsData.length > 0 ? selectedItemsData : cartItems,
    [selectedItemsData, cartItems]
  );

  const checkoutTotal = useMemo(() =>
    itemsToCheckout.reduce((acc, item) => {
        const price = parseFloat(item.product.selling_price || item.product.price || 0);
        const quantity = parseInt(item.quantity, 10) || 1;
        return acc + (price * quantity);
    }, 0),
    [itemsToCheckout]
  );
  
  const checkoutItemCount = itemsToCheckout.length;
  const isAllSelected = cartItems.length > 0 && selectedItems.size === cartItems.length;

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  };

  const handleRemoveSelected = () => {
    if (selectedItems.size > 0) {
      const productIdsToRemove = cartItems
        .filter(item => selectedItems.has(item.id))
        .map(item => item.product.id);
      removeItems(productIdsToRemove);
    }
  };

  const handleProceedToCheckout = () => {
    if (itemsToCheckout.length > 0) {
      prepareForCheckout(itemsToCheckout);
      navigate('/checkout');
    }
  };
  
  if (loading) {
      return (
          <div className="container mx-auto px-4 py-10 text-center flex flex-col items-center justify-center h-[60vh]">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading your cart...</p>
          </div>
      );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 text-center flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">{t('cart_empty')}</h2>
        <Button size="lg" onClick={() => navigate('/')} className="bg-blue-600 text-white hover:bg-blue-700">
          {t('Continue shopping')}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> {t('back')}
      </Button>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold leading-none tracking-tight">{t('your_cart')}</h2>
            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                 <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleRemoveSelected} disabled={selectedItems.size === 0}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('Remove selected')}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={clearCart}>
                        {t('Clear Cart')}
                    </Button>
                 </div>
                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="select-all" checked={isAllSelected} onChange={handleSelectAll} className="h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    <label htmlFor="select-all" className="text-sm font-medium leading-none">
                        {t('Select all')}
                    </label>
                </div>
            </div>
        </div>
        <hr className="border-border" />
        <div className="p-0">
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <div className="flex flex-col sm:flex-row items-center p-4 sm:p-6 gap-4">
                  <div className="flex items-center gap-4 w-full sm:flex-1">
                    <input type="checkbox" aria-label={`Select ${item.product.name}`} checked={selectedItems.has(item.id)} onChange={() => handleSelectItem(item.id)} className="h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
                    {/* THIS IS THE FIX: Use the standardized 'image' property */}
                    <img src={item.product.image || `https://placehold.co/80x80?text=${item.product.name?.[0]}`} alt={item.product.name} className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded border" />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">₹{(parseFloat(item.product.selling_price || item.product.price || 0)).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => updateQuantity(item.product.id, parseInt(item.quantity, 10) - 1)}>−</Button>
                        <span className="px-3 sm:px-4 py-2 border rounded-md min-w-[45px] sm:min-w-[50px] text-center">{item.quantity}</span>
                        <Button variant="outline" size="icon" onClick={() => updateQuantity(item.product.id, parseInt(item.quantity, 10) + 1)}>+</Button>
                    </div>
                    <p className="font-semibold text-md sm:text-lg w-24 sm:w-28 text-right">
                      ₹{((parseFloat(item.product.selling_price || item.product.price || 0)) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
                {index < cartItems.length - 1 && <hr className="border-border" />}
              </React.Fragment>
            ))}
          </div>
        </div>
        <hr className="border-border"/>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-muted/50">
            <h3 className="text-lg sm:text-xl font-bold">
                {selectedItems.size > 0 ? t('Selected total') : t('Grand Total')}: <span className="text-primary">₹{checkoutTotal.toFixed(2)}</span>
            </h3>
            {/* Implemented the requested active/inactive styling */}
            <Button 
              size="lg" 
              onClick={handleProceedToCheckout} 
              disabled={itemsToCheckout.length === 0}
              className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
            >
                {t('Proceed to checkout')} ({checkoutItemCount})
            </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

