// RecommendedProducts.tsx
import { Suspense, useState, useRef, useEffect } from 'react';
import { Await, useFetcher } from '@remix-run/react';
import { ProductCard, PRODUCT_CARD_FRAGMENT, ProductNode } from './ProductCard';
import type { CollectionProductsQuery } from 'storefrontapi.generated';

// SVGs omited…
// Placeholder Arrow SVG components
const ArrowLeftIcon = () => (
    <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.40179 0.182292L0.6875 4.55729C0.5625 4.67882 0.5 4.82639 0.5 5C0.5 5.17361 0.5625 5.32118 0.6875 5.44271L5.40179 9.81771C5.72321 10.0608 6.02679 10.0608 6.3125 9.81771C6.5625 9.50521 6.5625 9.21007 6.3125 8.93229L2.75 5.625H11.8571C12.25 5.59028 12.4643 5.38194 12.5 5C12.4643 4.61806 12.25 4.40972 11.8571 4.375H2.75L6.3125 1.06771C6.5625 0.789931 6.5625 0.494792 6.3125 0.182292C6.02679 -0.0607639 5.72321 -0.0607639 5.40179 0.182292Z" fill="#1B1F23" />
    </svg>
);
const ArrowRightIcon = () => (
    <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.59821 0.182292L12.3125 4.55729C12.4375 4.67882 12.5 4.82639 12.5 5C12.5 5.17361 12.4375 5.32118 12.3125 5.44271L7.59821 9.81771C7.27679 10.0608 6.97321 10.0608 6.6875 9.81771C6.4375 9.50521 6.4375 9.21007 6.6875 8.93229L10.25 5.625H1.14286C0.75 5.59028 0.535714 5.38194 0.5 5C0.535714 4.61806 0.75 4.40972 1.14286 4.375H10.25L6.6875 1.06771C6.4375 0.789931 6.4375 0.494792 6.6875 0.182292C6.97321 -0.0607639 7.27679 -0.0607639 7.59821 0.182292Z" fill="#1B1F23" />
    </svg>
);

interface Props {
    initialCollection: CollectionProductsQuery['collection'] | null;
}

// Mapeo de categorías a IDs de colección (Añade los IDs que faltan si los tienes)
const categoryCollectionIds: { [key: string]: string } = {
    'Sleep': 'gid://shopify/Collection/509335437588',
    'Cognitive Function': 'gid://shopify/Collection/509335503124',
    'Foundational Health': 'gid://shopify/Collection/509335535892',
    'Athletic Performance': 'gid://shopify/Collection/509340090644',
    'Hormone Support': 'gid://shopify/Collection/509340123412',
};

// Definir las categorías que tienen un ID asociado
const availableCategories = Object.keys(categoryCollectionIds);

export default function Bundles({ initialCollection }: Props) {
    const fetcher = useFetcher<CollectionProductsQuery>();
    const [selectedCategory, setSelectedCategory] = useState(availableCategories[0] || 'Sleep');
    const [startIndex, setStartIndex] = useState(0);
    const carouselContainerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number | null>(null);
    const gapPx = 24;
    const itemsPerPage = 4;

    // Efecto para iniciar la carga de datos
    useEffect(() => {
        const isInitialCategory = selectedCategory === availableCategories[0];
        if (isInitialCategory && initialCollection) {
            return; 
        }
        const collectionId = categoryCollectionIds[selectedCategory];
        if (collectionId) {
            if (fetcher.state === 'idle' && (!fetcher.data || (fetcher.data.collection as any)?.id !== collectionId)) {
                fetcher.load(`/api/collection-products?collectionId=${collectionId}`);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory, initialCollection]); // Depende solo de la categoría y datos iniciales

    const handleCategoryClick = (category: string) => {
        if (category !== selectedCategory) {
            setSelectedCategory(category);
            setStartIndex(0);
        }
    };

    // Hook para ResizeObserver
    useEffect(() => {
        const el = carouselContainerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            setContainerWidth(entry.contentRect.width);
        });
        ro.observe(el);
        setContainerWidth(el.offsetWidth);
        return () => ro.disconnect();
    }, []); // Ejecutar solo una vez al montar

    // Determinar qué datos mostrar de forma unificada
    const isInitialCategorySelected = selectedCategory === availableCategories[0];
    let currentCollectionData: CollectionProductsQuery['collection'] | null | undefined = null;

    if (isInitialCategorySelected && initialCollection) {
        currentCollectionData = initialCollection;
    } else if (fetcher.data?.collection) {
        if (!isInitialCategorySelected || !initialCollection) {
             currentCollectionData = fetcher.data.collection;
        }
    }
    if (!currentCollectionData && isInitialCategorySelected && initialCollection) {
        currentCollectionData = initialCollection;
    }

    // Usamos 'as any' temporalmente para evitar error de linter.
    const productsToShow: ProductNode[] = (currentCollectionData?.products?.nodes || []) as ProductNode[];
    const collectionTitle = (currentCollectionData as any)?.title ?? "Bundles";
    const collectionHandle = (currentCollectionData as any)?.handle ?? 'all';

    // Lógica del carrusel
    const handlePrev = () => setStartIndex(i => Math.max(0, i - 1));
    const handleNext = () =>
        setStartIndex(i =>
            Math.min(Math.max(0, productsToShow.length - itemsPerPage), i + 1)
        );

    const canPrev = startIndex > 0;
    const canNext = startIndex < productsToShow.length - itemsPerPage;
    const itemW = containerWidth !== null
        ? (containerWidth - (itemsPerPage - 1) * gapPx) / itemsPerPage
        : 0;
    const tx = containerWidth !== null
        ? startIndex * (itemW + gapPx)
        : 0;

    // Renderizar el componente
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-screen">
                {/* Header y botones de categoría */}
                <div className="flex flex-row items-center justify-between mb-8 w-full">
                    <div className="text-center flex flex-row items-center gap-32 ">
                        <div className="text-center flex flex-row items-center justify-start ">
                            <div className="text-start">
                                <p className="text-base text-[#1B1F23] ">
                                    <span role="img" aria-label="thinking face" >📦</span> Goals Specific
                                </p>
                                <h2 className="mt-2 text-[40px] leading-[40px] font-medium tracking-tight text-gray-900 sm:text-4xl">
                                    Bundles
                                </h2>
                            </div>
                        </div>
                        <div className='flex flex-row items-center justify-center gap-12 text-[#1B1F23] text-[14px]'>
                            {availableCategories.map((category) => (
                                <li
                                    key={category}
                                    className={`list-none cursor-pointer ${selectedCategory === category ? 'underline underline-offset-10 decoration-1' : ''}`}
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    {category}
                                </li>
                            ))}
                        </div>
                    </div>
                    {/* Botones de navegación del carrusel */}
                    <div className="flex flex-row items-center justify-end gap-4">
                        <div className="text-center">
                            <a href={`/collections/${collectionHandle}`} className="text-[18px] text-[#1B1F23] hover:text-[#1B1F23]/50 underline mt-2 inline-block">View All Bundles</a>
                        </div>
                        <button
                            className={`p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors ${!canPrev ? 'opacity-50 cursor-default' : 'hover:bg-gray-200 cursor-pointer'}`}
                            onClick={handlePrev} disabled={!canPrev || fetcher.state === 'loading'} aria-label="Previous products"
                        >
                            <ArrowLeftIcon />
                        </button>
                        <button
                            className={`p-3 rounded-[4px] border border-[#1B1F23]/10 bg-[#f5f5f5] transition-colors ${!canNext ? 'opacity-50 cursor-default' : 'hover:bg-gray-200 cursor-pointer'}`}
                            onClick={handleNext} disabled={!canNext || fetcher.state === 'loading'} aria-label="Next products"
                        >
                            <ArrowRightIcon />
                        </button>
                    </div>
                </div>

                {/* Contenedor del carrusel con minHeight fijo */}
                <div 
                    ref={carouselContainerRef} 
                    className="overflow-hidden w-full relative" 
                    style={{ minHeight: '500px' }} // Altura mínima fija (ajusta el valor si es necesario)
                >
                    {/* Div interno sin clases de transición */}
                    <div
                        className="flex" 
                        style={{
                            gap: `${gapPx}px`,
                            transform: `translateX(-${tx}px)`,
                        }}
                    >
                         {containerWidth !== null && productsToShow.length > 0 ? (
                            productsToShow.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    style={{ width: `${itemW}px`, flexShrink: 0 }}
                                    version='bundle'
                                />
                            ))
                        ) : (
                             fetcher.state !== 'loading' && <div className="text-center py-10 w-full">No products found in {collectionTitle}.</div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
