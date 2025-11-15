import React from "react";

const BookingCardSkeleton = () => {
	return (
		<div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden animate-pulse">
			{/* Header */}
			<div className="bg-gradient-to-r from-gray-300 to-gray-400 p-4 h-20"></div>

			{/* Content */}
			<div className="p-4 space-y-3">
				{/* Teacher */}
				<div className="flex items-start pb-3 border-b">
					<div className="w-6 h-6 bg-gray-300 rounded mr-3 mt-1"></div>
					<div className="flex-1 space-y-2">
						<div className="h-4 bg-gray-300 rounded w-3/4"></div>
						<div className="h-3 bg-gray-200 rounded w-1/2"></div>
					</div>
				</div>

				{/* Date & Time */}
				<div className="flex items-start">
					<div className="w-6 h-6 bg-gray-300 rounded mr-3 mt-1"></div>
					<div className="flex-1 space-y-2">
						<div className="h-4 bg-gray-300 rounded w-2/3"></div>
						<div className="h-3 bg-gray-200 rounded w-1/2"></div>
					</div>
				</div>

				{/* Location */}
				<div className="flex items-center">
					<div className="w-6 h-6 bg-gray-300 rounded mr-3"></div>
					<div className="h-4 bg-gray-300 rounded flex-1"></div>
				</div>

				{/* Details */}
				<div className="grid grid-cols-2 gap-2 pt-2 border-t">
					<div className="h-3 bg-gray-200 rounded"></div>
					<div className="h-3 bg-gray-200 rounded"></div>
				</div>

				{/* Price */}
				<div className="flex justify-between pt-2 border-t">
					<div className="h-4 bg-gray-200 rounded w-1/4"></div>
					<div className="h-6 bg-gray-300 rounded w-1/3"></div>
				</div>
			</div>

			{/* Actions */}
			<div className="p-4 bg-gray-50 border-t flex gap-2 justify-end">
				<div className="h-10 bg-gray-300 rounded w-24"></div>
				<div className="h-10 bg-gray-300 rounded w-24"></div>
			</div>
		</div>
	);
};

export default BookingCardSkeleton;
