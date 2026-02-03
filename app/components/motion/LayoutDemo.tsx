"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const items = [
  { id: 1, color: "from-rose-400 to-pink-500", label: "A" },
  { id: 2, color: "from-amber-400 to-orange-500", label: "B" },
  { id: 3, color: "from-emerald-400 to-teal-500", label: "C" },
  { id: 4, color: "from-blue-400 to-indigo-500", label: "D" },
];

export default function LayoutDemo() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [listItems, setListItems] = useState(items);

  const shuffleItems = () => {
    setListItems((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const selectedItem = listItems.find((item) => item.id === selectedId);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
          Layout Animations
        </h3>
        <button
          onClick={shuffleItems}
          className="px-3 py-1.5 bg-emerald-500 text-white text-sm rounded-lg hover:bg-emerald-600 transition-colors"
        >
          섞기
        </button>
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        layout, layoutId, AnimatePresence
      </p>

      {/* Layout shuffle */}
      <div className="bg-zinc-100 dark:bg-zinc-700 rounded-lg p-4 mb-4">
        <div className="flex gap-2 justify-center">
          {listItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              layoutId={`item-${item.id}`}
              onClick={() => setSelectedId(item.id)}
              className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl cursor-pointer flex items-center justify-center shadow-md`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-bold">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Expanded card overlay */}
      <AnimatePresence>
        {selectedId && selectedItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              layoutId={`item-${selectedId}`}
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br ${selectedItem.color} rounded-2xl z-50 flex items-center justify-center shadow-2xl cursor-pointer`}
              onClick={() => setSelectedId(null)}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-white font-bold text-4xl"
              >
                {selectedItem.label}
              </motion.span>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <p className="text-xs text-center text-zinc-500 dark:text-zinc-400 mt-2">
        카드를 클릭하면 확대됩니다
      </p>
    </div>
  );
}
