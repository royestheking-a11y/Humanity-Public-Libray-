import { motion } from "motion/react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export function Skeleton({ className = "", width, height, borderRadius = "0.5rem" }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 ${className}`}
      style={{ width, height, borderRadius }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      />
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <div className="relative h-[100vh] min-h-[600px] bg-gray-100 flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 w-full">
          <div className="max-w-3xl">
            <Skeleton width={120} height={32} borderRadius="2rem" className="mb-6" />
            <Skeleton width="80%" height={80} className="mb-4" />
            <Skeleton width="60%" height={80} className="mb-8" />
            <Skeleton width="90%" height={24} className="mb-2" />
            <Skeleton width="70%" height={24} className="mb-10" />
            <div className="flex gap-4">
              <Skeleton width={160} height={56} borderRadius="1rem" />
              <Skeleton width={160} height={56} borderRadius="1rem" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <Skeleton width={56} height={56} borderRadius="1rem" className="mx-auto mb-4" />
                <Skeleton width={100} height={32} className="mx-auto mb-2" />
                <Skeleton width={140} height={16} className="mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Skeleton */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <Skeleton width={100} height={20} className="mb-2" />
              <Skeleton width={300} height={40} />
            </div>
            <Skeleton width={120} height={20} className="hidden md:block" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <Skeleton width="100%" height={200} borderRadius={0} />
                <div className="p-6">
                  <Skeleton width="80%" height={24} className="mb-2" />
                  <Skeleton width="50%" height={16} className="mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton width={80} height={16} />
                    <Skeleton width={100} height={36} borderRadius="0.5rem" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function LibrarySkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12">
          <Skeleton width={200} height={48} className="mb-4" />
          <div className="flex flex-wrap gap-4">
            <Skeleton width="100%" height={56} borderRadius="1rem" className="max-w-md" />
            <Skeleton width={120} height={56} borderRadius="1rem" />
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <Skeleton width={120} height={24} className="mb-4" />
                <div className="space-y-2">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton key={j} width="100%" height={32} borderRadius="0.5rem" />
                  ))}
                </div>
              </div>
            ))}
          </aside>

          {/* Grid */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <Skeleton width="100%" height={220} borderRadius="1rem" className="mb-4" />
                <Skeleton width="90%" height={24} className="mb-2" />
                <Skeleton width="60%" height={16} className="mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton width={60} height={20} />
                  <Skeleton width={100} height={32} borderRadius="0.5rem" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-6 mb-12">
          <Skeleton width={100} height={100} borderRadius="50%" />
          <div>
            <Skeleton width={250} height={40} className="mb-2" />
            <Skeleton width={150} height={20} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <Skeleton width={40} height={40} borderRadius="0.5rem" className="mb-4" />
              <Skeleton width={80} height={32} className="mb-1" />
              <Skeleton width={120} height={16} />
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton width={200} height={28} className="mb-4" />
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <Skeleton width={60} height={80} borderRadius="0.5rem" />
                  <div className="flex-1">
                    <Skeleton width="60%" height={20} className="mb-2" />
                    <Skeleton width="40%" height={16} />
                  </div>
                  <Skeleton width={80} height={36} borderRadius="0.5rem" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton width={180} height={28} className="mb-4" />
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3 items-center mb-4 last:mb-0">
                  <Skeleton width={40} height={40} borderRadius="50%" />
                  <div className="flex-1">
                    <Skeleton width="80%" height={14} className="mb-1" />
                    <Skeleton width="40%" height={12} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <Skeleton width={300} height={48} className="mb-6" />
        <Skeleton width="100%" height={300} borderRadius="2rem" className="mb-12" />
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Skeleton width="100%" height={24} />
            <Skeleton width="100%" height={24} />
            <Skeleton width="80%" height={24} />
            <Skeleton width="90%" height={24} />
          </div>
          <div className="space-y-4">
            <Skeleton width="100%" height={200} borderRadius="1rem" />
            <div className="flex gap-4">
              <Skeleton width={100} height={40} borderRadius="0.5rem" />
              <Skeleton width={100} height={40} borderRadius="0.5rem" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
