const mongoose = require('mongoose');
const { Types } = require('mongoose');

const getcalculationcompleted = (salespersonId, propertyId, dateFrom, dateTo) => {
    return [{
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                'totalAmount': 1,
                'otherAmountTotal': 1,
                'totalPaidAmount': 1,
                'grandTotal': 1,
                'discountGrandTotal': 1,
                'loyaltypointsDiscounts': 1,
                'loyaltypoints': 1,
                'propertyId': 1,
                'totalTaxAmount': 1,
                'totalPaidAmount': 1,
                'bookingStatus': 1,
                'rooms': 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                'totalAmount': 1,
                'otherAmountTotal': 1,
                'grandTotal': 1,
                'discountGrandTotal': 1,
                'loyaltypointsDiscounts': 1,
                'loyaltypoints': 1,
                'propertyId': 1,
                'bookingStatus': 1,
                'totalTaxAmount': 1,
                'totalPaidAmount': 1,
                'rooms': 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                ...(salespersonId) && { 'salespersonId': Types.ObjectId(salespersonId) },
                'propertyId': Types.ObjectId(propertyId),
                bookingStatus: "Completed",
                ...(dateFrom) && {
                    $and: [{
                        'checkOutDates': { '$gte': dateFrom },
                        'checkOutDates': { '$lte': dateTo },
                    }],
                }

            }
        },
        {
            '$unwind': '$rooms'
        },
        {
            '$group': {
                '_id': '$propertyId',
                'totalTaxAmount': {
                    '$sum': { '$round': ['$totalTaxAmount', 0] }
                },
                'totalPaidAmount': {
                    '$sum': { '$round': ['$totalPaidAmount', 0] }
                },
                'totalRooms': {
                    '$sum': 1
                }
            }
        }

    ]
}

const getarrivalroomCountPileLine = (propertyId, dateFrom, dateTo) => {
    const checkInDates1 = dateFrom.toString();
    const checkInDates2 = dateTo.toString();

    return [{
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                'propertyId': 1,
                'bookingStatus': 1,
                'rooms': 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                'propertyId': 1,
                'bookingStatus': 1,
                'rooms': 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },
        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["CheckedIn", "Ordered"] },
                'checkInDates': { '$gte': checkInDates1, '$lte': checkInDates2 },

            }
        },
        {
            '$group': {
                '_id': '$propertyId',
                'totalRooms': {
                    '$sum': { '$size': '$rooms' }
                }
            }
        }


    ]
}

const arrivalReportTotalPipeline = (propertyId, dateFrom, dateTo) => {
    const checkInDates1 = dateFrom.toString();
    const checkInDates2 = dateTo.toString();
    return [{
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                'bookingStatus': 1,
                'propertyId': 1,
                'totalPaidAmount': 1,
                'advanceAmount': 1,
                'rooms': 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                'bookingStatus': 1,
                'propertyId': 1,
                'totalPaidAmount': 1,
                'advanceAmount': 1,
                'rooms': 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["CheckedIn", "Ordered"] },
                'checkInDates': { '$gte': checkInDates1, '$lte': checkInDates2 },

            }
        },
        {
            '$group': {
                '_id': '$propertyId',
                'totalAmount': { '$sum': '$advanceAmount' }
            }
        }


    ]
}

const arrivalReportPipeline = (propertyId, dateFrom, dateTo) => {
    const checkInDates1 = dateFrom.toString();
    const checkInDates2 = dateTo.toString();

    return [{
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                "bookingDisplayId": 1,
                "bookingOrderDisplayId": 1,
                "propertyDisplayId": 1,
                "propertyId": 1,
                "propertyName": 1,
                "propertyAddress": 1,
                "propertyImages": 1,
                "propertydefaultImage": 1,
                "noOfNights": 1,
                "categoryId": 1,
                "categoryName": 1,
                "userId": 1,
                "fullName": 1,
                "userEmailId": 1,
                "mobile": 1,
                "city": 1,
                "nationality": 1,
                "purposeofvisit": 1,
                "idProoftype": 1,
                "idProofNumber": 1,
                "address": 1,
                "userProfilePic": 1,
                "gender": 1,
                "numberOfAdult": 1,
                "numberOfChild": 1,
                "numberOfRoom": 1,
                "checkInDate": 1,
                "checkOutDate": 1,
                "otherAmountTotal": 1,
                "grandTotalWadvance": 1,
                "otherDiscountAmount": 1,
                "otherDiscountName": 1,
                "promoCodeDiscount": 1,
                "promoCodeName": 1,
                "advanceAmount": 1,
                "totalAmount": 1,
                "discountGrandTotal": 1,
                "otherAmounts": 1,
                "loyaltypoints": 1,
                "loyaltypointsDiscounts": 1,
                "grandTotal": 1,
                "salespersonId": 1,
                "salespersonName": 1,
                "salespersonEmailId": 1,
                "salespersonMobile": 1,
                "salespersonCompanyName": 1,
                "salespersonRole": 1,
                "roomId": 1,
                "roomName": 1,
                "empId": 1,
                "empName": 1,
                "empEmailID": 1,
                "typeOfAdmin": 1,
                "loyaltyDiscountper": 1,
                "earnedLoyalty": 1,
                "userLoyaltypointsBefore": 1,
                "userLoyaltypointsAfter": 1,
                "paymentBy": 1,
                "bookingStatus": 1,
                "bookingQrCode": 1,
                "note": 1,
                "allMeals": 1,
                "kotstatus": 1,
                "roomCategorys": 1,
                "roomMealsType": 1,
                "rooms": 1,
                "roomCategory": 1,
                "roomCategoryId": 1,
                "loyaltyPaidAmount": 1,
                "totalPendingAmount": 1,
                "totalPaidAmount": 1,
                "mealsType": 1,
                "cancelReason": 1,
                "cancelledBy": 1,
                "createdAt": 1,
                "updatedAt": 1,
                "bookingNumber": 1,
                "propertylat": 1,
                "propertylong": 1,
                "GSTNumber": 1,
                "supportMobile": 1,
                "supportEmailId": 1,
                "cancellationPolicy": 1,
                "propertyMapUrl": 1,
                "services": 1,
                "orders": 1,
                "roomAmenities": 1,
                "totalTax": 1,
                "totalTaxAmount": 1,
                "paymentMode": 1,
                "paymentLogs": 1,
                "tax": 1,
                "rating": 1,
                "taxDetails": 1,
                "checkInDate": 1,
                "checkOutDate": 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                "bookingDisplayId": 1,
                "bookingOrderDisplayId": 1,
                "propertyDisplayId": 1,
                "propertyId": 1,
                "propertyName": 1,
                "propertyAddress": 1,
                "propertyImages": 1,
                "propertydefaultImage": 1,
                "noOfNights": 1,
                "categoryId": 1,
                "categoryName": 1,
                "userId": 1,
                "fullName": 1,
                "userEmailId": 1,
                "mobile": 1,
                "city": 1,
                "nationality": 1,
                "purposeofvisit": 1,
                "idProoftype": 1,
                "idProofNumber": 1,
                "address": 1,
                "userProfilePic": 1,
                "gender": 1,
                "numberOfAdult": 1,
                "numberOfChild": 1,
                "numberOfRoom": 1,
                "checkInDate": 1,
                "checkOutDate": 1,
                "otherAmountTotal": 1,
                "grandTotalWadvance": 1,
                "otherDiscountAmount": 1,
                "otherDiscountName": 1,
                "promoCodeDiscount": 1,
                "promoCodeName": 1,
                "advanceAmount": 1,
                "totalAmount": 1,
                "discountGrandTotal": 1,
                "otherAmounts": 1,
                "loyaltypoints": 1,
                "loyaltypointsDiscounts": 1,
                "grandTotal": 1,
                "salespersonId": 1,
                "salespersonName": 1,
                "salespersonEmailId": 1,
                "salespersonMobile": 1,
                "salespersonCompanyName": 1,
                "salespersonRole": 1,
                "roomId": 1,
                "roomName": 1,
                "empId": 1,
                "empName": 1,
                "empEmailID": 1,
                "typeOfAdmin": 1,
                "loyaltyDiscountper": 1,
                "earnedLoyalty": 1,
                "userLoyaltypointsBefore": 1,
                "userLoyaltypointsAfter": 1,
                "paymentBy": 1,
                "bookingStatus": 1,
                "bookingQrCode": 1,
                "note": 1,
                "allMeals": 1,
                "kotstatus": 1,
                "roomCategorys": 1,
                "roomMealsType": 1,
                "rooms": 1,
                "roomCategory": 1,
                "roomCategoryId": 1,
                "loyaltyPaidAmount": 1,
                "totalPendingAmount": 1,
                "totalPaidAmount": 1,
                "mealsType": 1,
                "cancelReason": 1,
                "cancelledBy": 1,
                "createdAt": 1,
                "updatedAt": 1,
                "bookingNumber": 1,
                "propertylat": 1,
                "propertylong": 1,
                "GSTNumber": 1,
                "supportMobile": 1,
                "supportEmailId": 1,
                "cancellationPolicy": 1,
                "propertyMapUrl": 1,
                "services": 1,
                "orders": 1,
                "roomAmenities": 1,
                "totalTax": 1,
                "totalTaxAmount": 1,
                "paymentMode": 1,
                "paymentLogs": 1,
                "tax": 1,
                "rating": 1,
                "taxDetails": 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["CheckedIn", "Ordered"] },
                'checkInDates': { '$gte': checkInDates1, '$lte': checkInDates2 },

            }
        },
        {
            "$sort": {
                'createdAt': -1
            }
        }
    ]
}
const getdepartureroomCountPileLine = (propertyId, dateFrom, dateTo) => {
    const checkOutDates1 = dateFrom.toString();
    const checkOutDates2 = dateTo.toString();

    return [{
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                'propertyId': 1,
                'bookingStatus': 1,
                'rooms': 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                'propertyId': 1,
                'bookingStatus': 1,
                'rooms': 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["Completed", "Hold", "CheckOut"] },
                'checkOutDates': { '$gte': checkOutDates1, '$lte': checkOutDates2 },
            }
        },
        {
            '$group': {
                '_id': '$propertyId',
                'totalRooms': {
                    '$sum': { '$size': '$rooms' }
                }
            }
        }


    ]
}

const departureReportTotalPipeline = (propertyId, dateFrom, dateTo) => {
    const checkOutDates1 = dateFrom.toString();
    const checkOutDates2 = dateTo.toString();
    return [{
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                'bookingStatus': 1,
                'propertyId': 1,
                'totalPaidAmount': 1,
                'rooms': 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                'bookingStatus': 1,
                'propertyId': 1,
                'totalPaidAmount': 1,
                'rooms': 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["Completed", "Hold", "CheckOut"] },
                'checkOutDates': { '$gte': checkOutDates1, '$lte': checkOutDates2 },

            }
        },
        {
            '$group': {
                '_id': '$propertyId',
                'totalAmount': { '$sum': '$totalPaidAmount' }
            }
        }

    ]
}

const departureReportPipeline = (propertyId, dateFrom, dateTo) => {
    const checkOutDates1 = dateFrom.toString();
    const checkOutDates2 = dateTo.toString();
    return [{
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                "bookingDisplayId": 1,
                "bookingOrderDisplayId": 1,
                "propertyDisplayId": 1,
                "propertyId": 1,
                "propertyName": 1,
                "propertyAddress": 1,
                "propertyImages": 1,
                "propertydefaultImage": 1,
                "noOfNights": 1,
                "categoryId": 1,
                "categoryName": 1,
                "userId": 1,
                "fullName": 1,
                "userEmailId": 1,
                "mobile": 1,
                "city": 1,
                "nationality": 1,
                "purposeofvisit": 1,
                "idProoftype": 1,
                "idProofNumber": 1,
                "address": 1,
                "userProfilePic": 1,
                "gender": 1,
                "numberOfAdult": 1,
                "numberOfChild": 1,
                "numberOfRoom": 1,
                "otherAmountTotal": 1,
                "grandTotalWadvance": 1,
                "otherDiscountAmount": 1,
                "otherDiscountName": 1,
                "promoCodeDiscount": 1,
                "promoCodeName": 1,
                "advanceAmount": 1,
                "totalAmount": 1,
                "discountGrandTotal": 1,
                "otherAmounts": 1,
                "loyaltypoints": 1,
                "loyaltypointsDiscounts": 1,
                "grandTotal": 1,
                "salespersonId": 1,
                "salespersonName": 1,
                "salespersonEmailId": 1,
                "salespersonMobile": 1,
                "salespersonCompanyName": 1,
                "salespersonRole": 1,
                "roomId": 1,
                "roomName": 1,
                "empId": 1,
                "empName": 1,
                "empEmailID": 1,
                "typeOfAdmin": 1,
                "loyaltyDiscountper": 1,
                "earnedLoyalty": 1,
                "userLoyaltypointsBefore": 1,
                "userLoyaltypointsAfter": 1,
                "paymentBy": 1,
                "bookingStatus": 1,
                "bookingQrCode": 1,
                "note": 1,
                "allMeals": 1,
                "kotstatus": 1,
                "roomCategorys": 1,
                "roomMealsType": 1,
                "rooms": 1,
                "roomCategory": 1,
                "roomCategoryId": 1,
                "loyaltyPaidAmount": 1,
                "totalPendingAmount": 1,
                "totalPaidAmount": 1,
                "mealsType": 1,
                "cancelReason": 1,
                "cancelledBy": 1,
                "createdAt": 1,
                "updatedAt": 1,
                "bookingNumber": 1,
                "propertylat": 1,
                "propertylong": 1,
                "GSTNumber": 1,
                "supportMobile": 1,
                "supportEmailId": 1,
                "cancellationPolicy": 1,
                "propertyMapUrl": 1,
                "services": 1,
                "orders": 1,
                "roomAmenities": 1,
                "totalTax": 1,
                "totalTaxAmount": 1,
                "paymentMode": 1,
                "paymentLogs": 1,
                "tax": 1,
                "rating": 1,
                "taxDetails": 1,
                'checkInDate': 1,
                'checkOutDate': 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }


            }
        },
        {
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                "bookingDisplayId": 1,
                "bookingOrderDisplayId": 1,
                "propertyDisplayId": 1,
                "propertyId": 1,
                "propertyName": 1,
                "propertyAddress": 1,
                "propertyImages": 1,
                "propertydefaultImage": 1,
                "noOfNights": 1,
                "categoryId": 1,
                "categoryName": 1,
                "userId": 1,
                "fullName": 1,
                "userEmailId": 1,
                "mobile": 1,
                "city": 1,
                "nationality": 1,
                "purposeofvisit": 1,
                "idProoftype": 1,
                "idProofNumber": 1,
                "address": 1,
                "userProfilePic": 1,
                "gender": 1,
                "numberOfAdult": 1,
                "numberOfChild": 1,
                "numberOfRoom": 1,
                "otherAmountTotal": 1,
                "grandTotalWadvance": 1,
                "otherDiscountAmount": 1,
                "otherDiscountName": 1,
                "promoCodeDiscount": 1,
                "promoCodeName": 1,
                "advanceAmount": 1,
                "totalAmount": 1,
                "discountGrandTotal": 1,
                "otherAmounts": 1,
                "loyaltypoints": 1,
                "loyaltypointsDiscounts": 1,
                "grandTotal": 1,
                "salespersonId": 1,
                "salespersonName": 1,
                "salespersonEmailId": 1,
                "salespersonMobile": 1,
                "salespersonCompanyName": 1,
                "salespersonRole": 1,
                "roomId": 1,
                "roomName": 1,
                "empId": 1,
                "empName": 1,
                "empEmailID": 1,
                "typeOfAdmin": 1,
                "loyaltyDiscountper": 1,
                "earnedLoyalty": 1,
                "userLoyaltypointsBefore": 1,
                "userLoyaltypointsAfter": 1,
                "paymentBy": 1,
                "bookingStatus": 1,
                "bookingQrCode": 1,
                "note": 1,
                "allMeals": 1,
                "kotstatus": 1,
                "roomCategorys": 1,
                "roomMealsType": 1,
                "rooms": 1,
                "roomCategory": 1,
                "roomCategoryId": 1,
                "loyaltyPaidAmount": 1,
                "totalPendingAmount": 1,
                "totalPaidAmount": 1,
                "mealsType": 1,
                "cancelReason": 1,
                "cancelledBy": 1,
                "createdAt": 1,
                "updatedAt": 1,
                "bookingNumber": 1,
                "propertylat": 1,
                "propertylong": 1,
                "GSTNumber": 1,
                "supportMobile": 1,
                "supportEmailId": 1,
                "cancellationPolicy": 1,
                "propertyMapUrl": 1,
                "services": 1,
                "orders": 1,
                "roomAmenities": 1,
                "totalTax": 1,
                "totalTaxAmount": 1,
                "paymentMode": 1,
                "paymentLogs": 1,
                "tax": 1,
                "rating": 1,
                "taxDetails": 1,
                'checkInDate': 1,
                'checkOutDate': 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["Completed", "Hold", "CheckOut"] },
                'checkOutDates': { '$gte': checkOutDates1, '$lte': checkOutDates2 },
            }
        }
    ]
}

const countdepartureReportPipeline = (propertyId, dateFrom, dateTo) => {
    const checkOutDates1 = dateFrom.toString();
    const checkOutDates2 = dateTo.toString();
    return [{
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                "bookingDisplayId": 1,
                "bookingStatus": 1,
                "bookingOrderDisplayId": 1,
                "propertyDisplayId": 1,
                "propertyId": 1,
                'checkOutDate': 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }


            }
        },
        {
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                "bookingDisplayId": 1,
                "bookingStatus": 1,
                "bookingOrderDisplayId": 1,
                "propertyDisplayId": 1,
                "propertyId": 1,
                'checkOutDate': 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["Completed", "Hold", "CheckOut"] },
                'checkOutDates': { '$gte': checkOutDates1, '$lte': checkOutDates2 },
            }
        },
        {
            $count: "totalCount"
        }
    ]
}

const countarrivalReportPipeline = (propertyId, dateFrom, dateTo) => {
    const checkInDates1 = dateFrom.toString();
    const checkInDates2 = dateTo.toString();

    return [{
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                "bookingDisplayId": 1,
                "bookingStatus": 1,
                "bookingOrderDisplayId": 1,
                "propertyDisplayId": 1,
                "propertyId": 1,
                'checkOutDate': 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }


            }
        },
        {
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                "bookingDisplayId": 1,
                "bookingStatus": 1,
                "bookingOrderDisplayId": 1,
                "propertyDisplayId": 1,
                "propertyId": 1,
                'checkOutDate': 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["CheckedIn", "Ordered"] },
                'checkInDates': { '$gte': checkInDates1, '$lte': checkInDates2 },
            }
        },
        {
            $count: "totalCount"
        }
    ]
}


const nightauditTotalBlockedroomsPipeline = (propertyId, dateFrom) => {
    const checkInDates1 = dateFrom.toString();
    return [{
            '$project': {
                '_id': 1,
                'rooms': 1,
                'amountWithoutTax': 1,
                'propertyId': 1,
                'bookingStatus': 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'rooms': 1,
                'amountWithoutTax': 1,
                'propertyId': 1,
                'bookingStatus': 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["Blocked"] },
                'checkInDates': { '$gte': checkInDates1, '$lte': checkInDates1 },

            }
        },
        {
            '$unwind': '$rooms'
        },
        {
            '$group': {
                '_id': null,
                'totalRooms': { '$sum': 1 }
            }
        }
    ]
}

const nightauditTotalgroupBySourcePipeline = (propertyId, dateFrom) => {
    const checkInDates1 = dateFrom.toString();
    return [{
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                'sourceBy': 1,
                'bookingStatus': 1,
                'propertyId': 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                'sourceBy': 1,
                'bookingStatus': 1,
                'propertyId': 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["Completed", "Hold", "CheckOut", "Ordered", "CheckedIn"] },
                'checkInDates': { '$gte': checkInDates1, '$lte': checkInDates1 },

            }
        },
        {
            '$group': {
                '_id': '$sourceBy',
                'totalCount': { '$sum': 1 }
            }
        }
    ]
}


const nightauditcheckOutReportPipeline = (propertyId, dateFrom) => {
    const checkOutDates1 = dateFrom.toString();

    return [{
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                "bookingDisplayId": 1,
                "bookingOrderDisplayId": 1,
                "propertyDisplayId": 1,
                "propertyId": 1,
                "propertyName": 1,
                "propertyAddress": 1,
                "propertyImages": 1,
                "propertydefaultImage": 1,
                "noOfNights": 1,
                "categoryId": 1,
                "categoryName": 1,
                "userId": 1,
                "fullName": 1,
                "userEmailId": 1,
                "mobile": 1,
                "city": 1,
                "nationality": 1,
                "purposeofvisit": 1,
                "idProoftype": 1,
                "idProofNumber": 1,
                "address": 1,
                "userProfilePic": 1,
                "gender": 1,
                "numberOfAdult": 1,
                "numberOfChild": 1,
                "numberOfRoom": 1,
                "otherAmountTotal": 1,
                "grandTotalWadvance": 1,
                "otherDiscountAmount": 1,
                "otherDiscountName": 1,
                "promoCodeDiscount": 1,
                "promoCodeName": 1,
                "advanceAmount": 1,
                "totalAmount": 1,
                "discountGrandTotal": 1,
                "otherAmounts": 1,
                "loyaltypoints": 1,
                "loyaltypointsDiscounts": 1,
                "grandTotal": 1,
                "salespersonId": 1,
                "salespersonName": 1,
                "salespersonEmailId": 1,
                "salespersonMobile": 1,
                "salespersonCompanyName": 1,
                "salespersonRole": 1,
                "roomId": 1,
                "roomName": 1,
                "empId": 1,
                "empName": 1,
                "empEmailID": 1,
                "typeOfAdmin": 1,
                "loyaltyDiscountper": 1,
                "earnedLoyalty": 1,
                "userLoyaltypointsBefore": 1,
                "userLoyaltypointsAfter": 1,
                "paymentBy": 1,
                "bookingStatus": 1,
                "bookingQrCode": 1,
                "note": 1,
                "allMeals": 1,
                "kotstatus": 1,
                "roomCategorys": 1,
                "roomMealsType": 1,
                "rooms": 1,
                "roomCategory": 1,
                "roomCategoryId": 1,
                "loyaltyPaidAmount": 1,
                "totalPendingAmount": 1,
                "totalPaidAmount": 1,
                "mealsType": 1,
                "cancelReason": 1,
                "cancelledBy": 1,
                "createdAt": 1,
                "updatedAt": 1,
                "bookingNumber": 1,
                "propertylat": 1,
                "propertylong": 1,
                "GSTNumber": 1,
                "supportMobile": 1,
                "supportEmailId": 1,
                "cancellationPolicy": 1,
                "propertyMapUrl": 1,
                "services": 1,
                "orders": 1,
                "roomAmenities": 1,
                "totalTax": 1,
                "totalTaxAmount": 1,
                "paymentMode": 1,
                "paymentLogs": 1,
                "tax": 1,
                "rating": 1,
                "taxDetails": 1,
                'checkInDate': 1,
                'checkOutDate': 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                },
                'checkOutDateNews': {
                    '$toDate': '$checkOutDateNew'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                "bookingDisplayId": 1,
                "bookingOrderDisplayId": 1,
                "propertyDisplayId": 1,
                "propertyId": 1,
                "propertyName": 1,
                "propertyAddress": 1,
                "propertyImages": 1,
                "propertydefaultImage": 1,
                "noOfNights": 1,
                "categoryId": 1,
                "categoryName": 1,
                "userId": 1,
                "fullName": 1,
                "userEmailId": 1,
                "mobile": 1,
                "city": 1,
                "nationality": 1,
                "purposeofvisit": 1,
                "idProoftype": 1,
                "idProofNumber": 1,
                "address": 1,
                "userProfilePic": 1,
                "gender": 1,
                "numberOfAdult": 1,
                "numberOfChild": 1,
                "numberOfRoom": 1,
                "otherAmountTotal": 1,
                "grandTotalWadvance": 1,
                "otherDiscountAmount": 1,
                "otherDiscountName": 1,
                "promoCodeDiscount": 1,
                "promoCodeName": 1,
                "advanceAmount": 1,
                "totalAmount": 1,
                "discountGrandTotal": 1,
                "otherAmounts": 1,
                "loyaltypoints": 1,
                "loyaltypointsDiscounts": 1,
                "grandTotal": 1,
                "salespersonId": 1,
                "salespersonName": 1,
                "salespersonEmailId": 1,
                "salespersonMobile": 1,
                "salespersonCompanyName": 1,
                "salespersonRole": 1,
                "roomId": 1,
                "roomName": 1,
                "empId": 1,
                "empName": 1,
                "empEmailID": 1,
                "typeOfAdmin": 1,
                "loyaltyDiscountper": 1,
                "earnedLoyalty": 1,
                "userLoyaltypointsBefore": 1,
                "userLoyaltypointsAfter": 1,
                "paymentBy": 1,
                "bookingStatus": 1,
                "bookingQrCode": 1,
                "note": 1,
                "allMeals": 1,
                "kotstatus": 1,
                "roomCategorys": 1,
                "roomMealsType": 1,
                "rooms": 1,
                "roomCategory": 1,
                "roomCategoryId": 1,
                "loyaltyPaidAmount": 1,
                "totalPendingAmount": 1,
                "totalPaidAmount": 1,
                "mealsType": 1,
                "cancelReason": 1,
                "cancelledBy": 1,
                "createdAt": 1,
                "updatedAt": 1,
                "bookingNumber": 1,
                "propertylat": 1,
                "propertylong": 1,
                "GSTNumber": 1,
                "supportMobile": 1,
                "supportEmailId": 1,
                "cancellationPolicy": 1,
                "propertyMapUrl": 1,
                "services": 1,
                "orders": 1,
                "roomAmenities": 1,
                "totalTax": 1,
                "totalTaxAmount": 1,
                "paymentMode": 1,
                "paymentLogs": 1,
                "tax": 1,
                "rating": 1,
                "taxDetails": 1,
                "checkInDate": 1,
                "checkOutDate": 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDateNews': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDateNews',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["Completed", "Hold", "CheckOut"] },
                //'checkOutDates': { '$gte': checkOutDates1, '$lte': checkOutDates1 }, 
                '$or': [{
                        'checkOutDates': { '$gte': checkOutDates1, '$lte': checkOutDates1 }
                    },
                    {
                        'checkOutDateNews': { '$gte': checkOutDates1, '$lte': checkOutDates1 }
                    }
                ]

            }
        }
    ]
}


const nightauditRevenueReportPipeline = (propertyId, dateFrom) => {
    const checkOutDates1 = dateFrom.toString();

    return [{
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                "bookingDisplayId": 1,
                "bookingOrderDisplayId": 1,
                "propertyDisplayId": 1,
                "propertyId": 1,
                "propertyName": 1,
                "propertyAddress": 1,
                "propertyImages": 1,
                "propertydefaultImage": 1,
                "noOfNights": 1,
                "categoryId": 1,
                "categoryName": 1,
                "userId": 1,
                "fullName": 1,
                "userEmailId": 1,
                "mobile": 1,
                "city": 1,
                "nationality": 1,
                "purposeofvisit": 1,
                "idProoftype": 1,
                "idProofNumber": 1,
                "address": 1,
                "userProfilePic": 1,
                "gender": 1,
                "numberOfAdult": 1,
                "numberOfChild": 1,
                "numberOfRoom": 1,
                "otherAmountTotal": 1,
                "grandTotalWadvance": 1,
                "otherDiscountAmount": 1,
                "otherDiscountName": 1,
                "promoCodeDiscount": 1,
                "promoCodeName": 1,
                "advanceAmount": 1,
                "totalAmount": 1,
                "discountGrandTotal": 1,
                "otherAmounts": 1,
                "loyaltypoints": 1,
                "loyaltypointsDiscounts": 1,
                "grandTotal": 1,
                "salespersonId": 1,
                "salespersonName": 1,
                "salespersonEmailId": 1,
                "salespersonMobile": 1,
                "salespersonCompanyName": 1,
                "salespersonRole": 1,
                "roomId": 1,
                "roomName": 1,
                "empId": 1,
                "empName": 1,
                "empEmailID": 1,
                "typeOfAdmin": 1,
                "loyaltyDiscountper": 1,
                "earnedLoyalty": 1,
                "userLoyaltypointsBefore": 1,
                "userLoyaltypointsAfter": 1,
                "paymentBy": 1,
                "bookingStatus": 1,
                "bookingQrCode": 1,
                "note": 1,
                "allMeals": 1,
                "kotstatus": 1,
                "roomCategorys": 1,
                "roomMealsType": 1,
                "rooms": 1,
                "roomCategory": 1,
                "roomCategoryId": 1,
                "loyaltyPaidAmount": 1,
                "totalPendingAmount": 1,
                "totalPaidAmount": 1,
                "mealsType": 1,
                "cancelReason": 1,
                "cancelledBy": 1,
                "createdAt": 1,
                "updatedAt": 1,
                "bookingNumber": 1,
                "propertylat": 1,
                "propertylong": 1,
                "GSTNumber": 1,
                "supportMobile": 1,
                "supportEmailId": 1,
                "cancellationPolicy": 1,
                "propertyMapUrl": 1,
                "services": 1,
                "orders": 1,
                "roomAmenities": 1,
                "totalTax": 1,
                "totalTaxAmount": 1,
                "paymentMode": 1,
                "paymentLogs": 1,
                "tax": 1,
                "rating": 1,
                "taxDetails": 1,
                'checkInDate': 1,
                'checkOutDate': 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                "bookingDisplayId": 1,
                "bookingOrderDisplayId": 1,
                "propertyDisplayId": 1,
                "propertyId": 1,
                "propertyName": 1,
                "propertyAddress": 1,
                "propertyImages": 1,
                "propertydefaultImage": 1,
                "noOfNights": 1,
                "categoryId": 1,
                "categoryName": 1,
                "userId": 1,
                "fullName": 1,
                "userEmailId": 1,
                "mobile": 1,
                "city": 1,
                "nationality": 1,
                "purposeofvisit": 1,
                "idProoftype": 1,
                "idProofNumber": 1,
                "address": 1,
                "userProfilePic": 1,
                "gender": 1,
                "numberOfAdult": 1,
                "numberOfChild": 1,
                "numberOfRoom": 1,
                "otherAmountTotal": 1,
                "grandTotalWadvance": 1,
                "otherDiscountAmount": 1,
                "otherDiscountName": 1,
                "promoCodeDiscount": 1,
                "promoCodeName": 1,
                "advanceAmount": 1,
                "totalAmount": 1,
                "discountGrandTotal": 1,
                "otherAmounts": 1,
                "loyaltypoints": 1,
                "loyaltypointsDiscounts": 1,
                "grandTotal": 1,
                "salespersonId": 1,
                "salespersonName": 1,
                "salespersonEmailId": 1,
                "salespersonMobile": 1,
                "salespersonCompanyName": 1,
                "salespersonRole": 1,
                "roomId": 1,
                "roomName": 1,
                "empId": 1,
                "empName": 1,
                "empEmailID": 1,
                "typeOfAdmin": 1,
                "loyaltyDiscountper": 1,
                "earnedLoyalty": 1,
                "userLoyaltypointsBefore": 1,
                "userLoyaltypointsAfter": 1,
                "paymentBy": 1,
                "bookingStatus": 1,
                "bookingQrCode": 1,
                "note": 1,
                "allMeals": 1,
                "kotstatus": 1,
                "roomCategorys": 1,
                "roomMealsType": 1,
                "rooms": 1,
                "roomCategory": 1,
                "roomCategoryId": 1,
                "loyaltyPaidAmount": 1,
                "totalPendingAmount": 1,
                "totalPaidAmount": 1,
                "mealsType": 1,
                "cancelReason": 1,
                "cancelledBy": 1,
                "createdAt": 1,
                "updatedAt": 1,
                "bookingNumber": 1,
                "propertylat": 1,
                "propertylong": 1,
                "GSTNumber": 1,
                "supportMobile": 1,
                "supportEmailId": 1,
                "cancellationPolicy": 1,
                "propertyMapUrl": 1,
                "services": 1,
                "orders": 1,
                "roomAmenities": 1,
                "totalTax": 1,
                "totalTaxAmount": 1,
                "paymentMode": 1,
                "paymentLogs": 1,
                "tax": 1,
                "rating": 1,
                "taxDetails": 1,
                'checkInDate': 1,
                'checkOutDate': 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },
        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["Completed", "Hold", "CheckOut", "Ordered", "CheckedIn"] },
                '$or': [{
                        'checkOutDates': { '$gte': checkOutDates1, '$lte': checkOutDates1 }
                    },
                    {
                        'checkInDates': { '$gte': checkOutDates1, '$lte': checkOutDates1 }
                    }
                ]
            }
        }

    ];
};



const totalcheckinroomfrommonthstarting = (propertyId, dateFrom, dateTo) => {
    const checkInDates1 = dateFrom.toString();
    const checkInDates2 = dateTo.toString();

    return [{
            '$project': {
                '_id': 1,
                'rooms': 1,
                'amountWithoutTax': 1,
                'propertyId': 1,
                'bookingStatus': 1,

                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                'rooms': 1,
                'propertyId': 1,
                'bookingStatus': 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["Completed", "Hold", "CheckOut", "Ordered", "CheckedIn"] },
                'checkInDates': { '$gte': checkInDates1, '$lte': checkInDates2 },

            }
        },
        {
            '$unwind': '$rooms'
        },
        {
            '$group': {
                '_id': null,
                'totalRooms': { '$sum': 1 }
            }
        }
    ]
}



const dailysummeryTotalPaidAmount = (propertyId, dateFrom) => {
    const checkInDates1 = dateFrom.toString();
    return [{
            '$project': {
                '_id': 1,
                'rooms': 1,
                'amountWithoutTax': 1,
                'propertyId': 1,
                'bookingStatus': 1,
                'totalPaidAmount': 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                'rooms': 1,
                'propertyId': 1,
                'bookingStatus': 1,
                'totalPaidAmount': 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["Completed", "Hold", "CheckOut", "Ordered", "CheckedIn"] },
                //  'checkInDates': { '$gte': checkInDates1, '$lte': checkInDates1 },

                '$or': [{
                        'checkOutDates': { '$gte': checkInDates1, '$lte': checkInDates1 }
                    },
                    {
                        'checkInDates': { '$gte': checkInDates1, '$lte': checkInDates1 }
                    }
                ]


            }
        },
        {
            '$group': {
                '_id': '$propertyId',
                'totalPaidAmount': {
                    '$sum': { '$round': ['$totalPaidAmount', 2] }
                }

            }
        }
    ]
}

const dailysummeryTotalPaidAmount2 = (propertyId, dateFrom, dateTo) => {
    const checkInDates1 = dateFrom.toString();
    const checkInDates2 = dateTo.toString();
    return [{
            '$project': {
                '_id': 1,
                'rooms': 1,
                'amountWithoutTax': 1,
                'propertyId': 1,
                'bookingStatus': 1,
                'totalPaidAmount': 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'amountWithoutTax': 1,
                'rooms': 1,
                'propertyId': 1,
                'bookingStatus': 1,
                'totalPaidAmount': 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },
        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["Completed", "Hold", "CheckOut", "Ordered", "CheckedIn"] },
                'checkInDates': { '$gte': checkInDates1, '$lte': checkInDates2 },

            }
        },
        {
            '$group': {
                '_id': '$propertyId',
                'totalPaidAmount': {
                    '$sum': { '$round': ['$totalPaidAmount', 2] }
                }

            }
        }
    ]
}



const totalTaxSummery = (propertyId, dateFrom) => {
    const checkInDates1 = dateFrom.toString();
    return [{
            '$project': {
                '_id': 1,
                'taxDetails': 1,
                'bookingStatus': 1,
                'propertyId': 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'taxDetails': 1,
                'bookingStatus': 1,
                'propertyId': 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["Completed", "Hold", "CheckOut", "Ordered", "CheckedIn"] },
                //  'checkInDates': { '$gte': checkInDates1, '$lte': checkInDates1 },
                '$or': [{
                        'checkOutDates': { '$gte': checkInDates1, '$lte': checkInDates1 }
                    },
                    {
                        'checkInDates': { '$gte': checkInDates1, '$lte': checkInDates1 }
                    }
                ]

            }
        },
        {
            '$unwind': '$taxDetails'
        },
        {
            '$project': {
                'taxDetails': '$taxDetails.taxName',
                'Amount': { '$toDouble': '$taxDetails.taxAmount' },
                'tax': '$taxDetails.tax'
            }
        },
        {
            '$group': {
                '_id': '$taxDetails',
                'tax': { '$first': '$tax' },
                'totalAmount': { '$sum': '$Amount' }
            }
        }

    ]
}


const totalPaymentRecived = (propertyId, dateFrom) => {
    const checkInDates1 = dateFrom.toString();
    return [{
            '$project': {
                '_id': 1,
                'paymentLogs': 1,
                'bookingStatus': 1,
                'propertyId': 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'paymentLogs': 1,
                'bookingStatus': 1,
                'propertyId': 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["Completed", "Hold", "CheckOut", "Ordered", "CheckedIn"] },
                // 'checkInDates': { '$gte': checkInDates1, '$lte': checkInDates1 },
                '$or': [{
                        'checkOutDates': { '$gte': checkInDates1, '$lte': checkInDates1 }
                    },
                    {
                        'checkInDates': { '$gte': checkInDates1, '$lte': checkInDates1 }
                    }
                ]

            }
        },
        {
            '$unwind': '$paymentLogs'
        },
        {
            '$project': {
                'paymentMode': '$paymentLogs.paymentMode',
                'Amount': { '$toDouble': '$paymentLogs.Amount' }
            }
        },
        {
            '$group': {
                '_id': '$paymentMode',
                'totalAmount': { '$sum': '$Amount' }
            }
        }

    ]
}





const totalPaymentInfo = (propertyId, dateFrom) => {
    const checkInDates1 = dateFrom.toString();
    return [{
            '$project': {
                '_id': 1,
                'paymentLogs': 1,
                'bookingStatus': 1,
                'propertyId': 1,
                'totalPendingAmount': 1,
                'totalPaidAmount': 1,
                'grandTotalWadvance': 1,
                'totalTaxAmount': 1,
                'orderType': 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'paymentLogs': 1,
                'bookingStatus': 1,
                'propertyId': 1,
                'totalPendingAmount': 1,
                'totalPaidAmount': 1,
                'grandTotalWadvance': 1,
                'totalTaxAmount': 1,
                'orderType': 1,

                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["Completed", "Hold", "CheckOut", "Ordered", "CheckedIn"] },
                'checkInDates': { '$gte': checkInDates1, '$lte': checkInDates1 },

            }
        },
        {
            '$group': {
                '_id': '$propertyId',
                'totalPendingAmount': { '$sum': '$totalPendingAmount' },
                'totalPaidAmount': { '$sum': '$totalPaidAmount' },
                'grandTotalWadvance': { '$sum': '$grandTotalWadvance' },
                'totalTaxAmount': { '$sum': '$totalTaxAmount' },
            }
        }



    ]
}

const tableorderdatataxPileLine2 = (propertyId, dateFrom) => {
    const checkOutDates = dateFrom.toString();
    return [{
            '$project': {
                '_id': 1,
                'orderDisplayId': 1,
                'billNumber': 1,
                'kotid': 1,
                'tableDisplayId': 1,
                'propertyId': 1,
                'subTotal': 1,
                'total': 1,
                'orderStatus': 1,
                'checkOutDate': 1,
                'propertyId': 1,
                'orderType': 1,
                'paymentLogs': 1,
                'taxDetails': 1,
                'paymentLogs': 1,
                'totalTaxAmount': 1,
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'orderDisplayId': 1,
                'billNumber': 1,
                'kotid': 1,
                'tableDisplayId': 1,
                'propertyId': 1,
                'subTotal': 1,
                'total': 1,
                'orderStatus': 1,
                'checkOutDate': 1,
                'orderType': 1,
                'totalTaxAmount': 1,
                'taxDetails': 1,
                'totalTaxAmount': 1,
                'paymentLogs': 1,
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'orderStatus': { '$in': ["Completed", "Ordered"] },
                'orderType': "Table",
                'checkOutDates': { '$gte': checkOutDates, '$lte': checkOutDates },

            }
        },

        {
            "$group": {
                "_id": "$orderDisplayId",
                "taxDetails": { "$first": "$taxDetails" },

            }
        },
        {
            "$unwind": "$taxDetails"
        },
        {
            "$project": {
                "taxName": "$taxDetails.taxName",
                "taxAmount": "$taxDetails.taxAmount",
                "tax": "$taxDetails.tax"
            }
        },
        {
            "$group": {
                "_id": "$taxName",
                "tax": { "$first": "$tax" },
                "taxDetails": { "$sum": "$taxAmount" },

            }
        }
    ]
}



const tableorderdataPaymentPileLine = (propertyId, dateFrom) => {
    const checkOutDates = dateFrom.toString();
    return [{
            '$project': {
                '_id': 1,
                'orderDisplayId': 1,
                'billNumber': 1,
                'kotid': 1,
                'tableDisplayId': 1,
                'propertyId': 1,
                'subTotal': 1,
                'total': 1,
                'orderStatus': 1,
                'checkOutDate': 1,
                'propertyId': 1,
                'orderType': 1,
                'paymentLogs': 1,
                'taxDetails': 1,
                'totalTaxAmount': 1,
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'orderDisplayId': 1,
                'billNumber': 1,
                'kotid': 1,
                'tableDisplayId': 1,
                'propertyId': 1,
                'subTotal': 1,
                'total': 1,
                'orderStatus': 1,
                'checkOutDate': 1,
                'orderType': 1,
                'totalTaxAmount': 1,
                'taxDetails': 1,
                'totalTaxAmount': 1,
                'paymentLogs': 1,
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'orderStatus': { '$in': ["Completed", "Ordered"] },
                'orderType': "Table",
                'checkOutDates': { '$gte': checkOutDates, '$lte': checkOutDates },

            }
        },

        {
            "$group": {
                "_id": "$orderDisplayId",
                "paymentLogs": { "$first": "$paymentLogs" },

            }
        },
        {
            "$unwind": "$paymentLogs"
        },
        {
            "$project": {
                "paymentMode": "$paymentLogs.paymentMode",
                "Amount": { "$toDouble": "$paymentLogs.Amount" }

            }
        },
        {
            "$group": {
                "_id": "$paymentMode",
                "Amount": { "$sum": "$Amount" }

            }
        }
    ]
}

/************************Booking order************************** */


const tableorderdatataxPileLine2Booking = (propertyId, dateFrom) => {
    const checkOutDates = dateFrom.toString();
    return [{
            '$project': {
                '_id': 1,
                'orderDisplayId': 1,
                'billNumber': 1,
                'kotid': 1,
                'tableDisplayId': 1,
                'propertyId': 1,
                'subTotal': 1,
                'total': 1,
                'orderStatus': 1,
                'checkOutDate': 1,
                'propertyId': 1,
                'orderType': 1,
                'paymentLogs': 1,
                'taxDetails': 1,
                'paymentLogs': 1,
                'totalTaxAmount': 1,
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'orderDisplayId': 1,
                'billNumber': 1,
                'kotid': 1,
                'tableDisplayId': 1,
                'propertyId': 1,
                'subTotal': 1,
                'total': 1,
                'orderStatus': 1,
                'checkOutDate': 1,
                'orderType': 1,
                'totalTaxAmount': 1,
                'taxDetails': 1,
                'totalTaxAmount': 1,
                'paymentLogs': 1,
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'orderStatus': { '$in': ["Completed", "Ordered"] },
                'orderType': "Booking",
                'checkOutDates': { '$gte': checkOutDates, '$lte': checkOutDates },

            }
        },

        {
            "$group": {
                "_id": "$orderDisplayId",
                "taxDetails": { "$first": "$taxDetails" },

            }
        },
        {
            "$unwind": "$taxDetails"
        },
        {
            "$project": {
                "taxName": "$taxDetails.taxName",
                "taxAmount": "$taxDetails.taxAmount",
                "tax": "$taxDetails.tax"
            }
        },
        {
            "$group": {
                "_id": "$taxName",
                "tax": { "$first": "$tax" },
                "taxDetails": { "$sum": "$taxAmount" },

            }
        }
    ]
}



const tableorderdataPaymentPileLineBooking = (propertyId, dateFrom) => {
    const checkOutDates = dateFrom.toString();
    return [{
            '$project': {
                '_id': 1,
                'orderDisplayId': 1,
                'billNumber': 1,
                'kotid': 1,
                'tableDisplayId': 1,
                'propertyId': 1,
                'subTotal': 1,
                'total': 1,
                'orderStatus': 1,
                'checkOutDate': 1,
                'propertyId': 1,
                'orderType': 1,
                'paymentLogs': 1,
                'taxDetails': 1,
                'totalTaxAmount': 1,
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'orderDisplayId': 1,
                'billNumber': 1,
                'kotid': 1,
                'tableDisplayId': 1,
                'propertyId': 1,
                'subTotal': 1,
                'total': 1,
                'orderStatus': 1,
                'checkOutDate': 1,
                'orderType': 1,
                'totalTaxAmount': 1,
                'taxDetails': 1,
                'totalTaxAmount': 1,
                'paymentLogs': 1,
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'orderStatus': { '$in': ["Completed", "Ordered"] },
                'orderType': "Booking",
                'checkOutDates': { '$gte': checkOutDates, '$lte': checkOutDates },

            }
        },

        {
            "$group": {
                "_id": "$orderDisplayId",
                "paymentLogs": { "$first": "$paymentLogs" },

            }
        },
        {
            "$unwind": "$paymentLogs"
        },
        {
            "$project": {
                "paymentMode": "$paymentLogs.paymentMode",
                "Amount": { "$toDouble": "$paymentLogs.Amount" },
                "grandTotal": { "$toDouble": "$paymentLogs.grandTotal" }
            }
        },
        {
            "$group": {
                "_id": "$paymentMode",
                "Amount": { "$sum": "$Amount" },
                "grandTotal": { "$sum": "$grandTotal" }
            }
        }
    ]
}


const nightauditTotalroomsPipelineByroomAbilibility = (propertyId, dateFrom) => {
    const checkInDates1 = dateFrom.toString();
    return [{
            '$project': {
                '_id': 1,
                'propertyId': 1,
                'bookingStatus': 1,
                'bookingDisplayId': 1,
                'roomId': 1,
                'roomName': 1,
                'checkInDates': {
                    '$toDate': '$checkInDate'
                },
                'checkOutDates': {
                    '$toDate': '$checkOutDate'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'propertyId': 1,
                'bookingStatus': 1,
                'bookingDisplayId': 1,
                'roomId': 1,
                'roomName': 1,
                'checkInDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkInDates',
                        'timezone': 'Asia/Kolkata'
                    }
                },
                'checkOutDates': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$checkOutDates',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                'bookingStatus': { '$in': ["Completed", "Hold", "CheckOut", "Ordered", "CheckedIn"] },
                $and: [{
                        'checkInDates': { '$gte': checkInDates1 },
                    },
                    {
                        'checkOutDates': { '$lte': checkInDates1 },
                    }

                ]


            }
        },
        {
            '$group': {
                '_id': '$roomId',
                'roomName': { '$first': '$roomName' },
            }
        }


    ]
}



const todayPaymentsPipeline = (propertyId, dateFrom) => {
    const createdAts1 = dateFrom.toString();
    return [{
            '$project': {
                '_id': 1,
                'paymentlogId': 1,
                'paymentLogs': 1,
                'propertyId': 1,
                'subTotal': 1,
                'orderDisplayId': 1,
                'paymentFor': 1,
                'paymentMode': 1,
                'totalTax': 1,
                'totalTaxAmount': 1,
                'taxDetails': 1,
                'paymentStatus': 1,
                'createdAts': {
                    '$toDate': '$createdAt'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'paymentlogId': 1,
                'paymentLogs': 1,
                'propertyId': 1,
                'subTotal': 1,
                'orderDisplayId': 1,
                'paymentFor': 1,
                'paymentMode': 1,
                'totalTax': 1,
                'totalTaxAmount': 1,
                'taxDetails': 1,
                'paymentStatus': 1,
                'createdAt': 1,
                'createdAts': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$createdAts',
                        'timezone': 'Asia/Kolkata'
                    }
                }


            }
        },
        {
            '$match': {
                'propertyId': mongoose.Types.ObjectId(propertyId),
                'createdAts': createdAts1,

            }
        },

        {
            '$group': {
                '_id': '$propertyId',
                'subTotal': { '$sum': '$subTotal' },
                'totalTaxAmount': { '$sum': '$totalTaxAmount' }
            }
        }
    ]
}


const todayPaymentsbyBookigForPipeLine = (propertyId, dateFrom) => {
    const createdAts1 = dateFrom.toString();
    return [{
            '$project': {
                '_id': 1,
                'paymentlogId': 1,
                'paymentLogs': 1,
                'propertyId': 1,
                'subTotal': 1,
                'orderDisplayId': 1,
                'paymentFor': 1,
                'paymentMode': 1,
                'totalTax': 1,
                'totalTaxAmount': 1,
                'taxDetails': 1,
                'paymentStatus': 1,
                'greandTotal': 1,
                'createdAts': {
                    '$toDate': '$createdAt'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'paymentlogId': 1,
                'paymentLogs': 1,
                'propertyId': 1,
                'subTotal': 1,
                'orderDisplayId': 1,
                'paymentFor': 1,
                'paymentMode': 1,
                'totalTax': 1,
                'totalTaxAmount': 1,
                'taxDetails': 1,
                'paymentStatus': 1,
                'subTotal': 1,
                'greandTotal': 1,
                'createdAt': 1,
                'createdAts': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$createdAts',
                        'timezone': 'Asia/Kolkata'
                    }
                }


            }
        },
        {
            '$match': {
                'propertyId': mongoose.Types.ObjectId(propertyId),
                'createdAts': createdAts1,

            }
        },

        {
            '$group': {
                '_id': '$paymentFor',
                'subTotal': { '$sum': '$subTotal' },
                'totalTaxAmount': { '$sum': '$totalTaxAmount' }
            }
        }
    ]
}



const todayPaymentsgroupbypaymentModePipeLine = (propertyId, dateFrom) => {
    const createdAts1 = dateFrom.toString();
    return [{
            '$project': {
                '_id': 1,
                'paymentlogId': 1,
                'paymentLogs': 1,
                'propertyId': 1,
                'subTotal': 1,
                'orderDisplayId': 1,
                'paymentFor': 1,
                'paymentMode': 1,
                'totalTax': 1,
                'totalTaxAmount': 1,
                'taxDetails': 1,
                'paymentStatus': 1,
                'createdAts': {
                    '$toDate': '$createdAt'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'paymentlogId': 1,
                'paymentLogs': 1,
                'propertyId': 1,
                'subTotal': 1,
                'orderDisplayId': 1,
                'paymentFor': 1,
                'paymentMode': 1,
                'totalTax': 1,
                'totalTaxAmount': 1,
                'taxDetails': 1,
                'paymentStatus': 1,
                'createdAt': 1,
                'createdAts': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$createdAts',
                        'timezone': 'Asia/Kolkata'
                    }
                }


            }
        },
        {
            '$match': {
                'propertyId': mongoose.Types.ObjectId(propertyId),
                'createdAts': createdAts1,

            }
        },
        {
            '$unwind': '$paymentLogs'
        },
        {
            '$addFields': {
                'paymentLogs.Amount': {
                    '$toDouble': '$paymentLogs.Amount'
                }
            }
        },
        {
            '$group': {
                '_id': '$paymentLogs.paymentMode',
                'Amount': { '$sum': '$paymentLogs.Amount' }
            }
        }
    ]
}

const todayOrderDataPipeline = (propertyId, dateFrom, orderType) => {
    const createdAtDate = dateFrom.toString();
    return [{
            '$project': {
                '_id': 1,
                'orderId': 1,
                'orderDisplayId': 1,
                'userName': 1,
                'userEmail': 1,
                'userMobile': 1,
                'orderNumber': 1,
                'orderStatus': 1,
                'tableDisplayId': 1,
                'tableNumber': 1,
                'tableCategoryId': 1,
                'tableCategoryName': 1,
                'kotstatus': 1,
                'orderItemId': 1,
                'productId': 1,
                'productName': 1,
                'productCode': 1,
                'propertyCategoryId': 1,
                'propertyCategoryName': 1,
                'productAmount': 1,
                'productDescription': 1,
                'productQuantity': 1,
                'taxDetails': 1,
                'totalTax': 1,
                'totalTaxAmount': 1,
                'total': 1,
                'totalAmountWithGst': 1,
                'subTotal': 1,
                'roomId': 1,
                'roomName': 1,
                'roomCategoryId': 1,
                'roomCategoryname': 1,
                'greandTotal': 1,
                'kotid': 1,
                'billNumber': 1,
                'propertyName': 1,
                'propertyId': 1,
                'bookingDisplayId': 1,
                'empId': 1,
                'empName': 1,
                'empEmailID': 1,
                'empType': 1,
                'paymentMode': 1,
                'paymentLogs': 1,
                'propertyinfo': 1,
                'orderType': 1,
                'booking': 1,
                'note': 1,
                'otherAmountTotal': 1,
                'otherAmounts': 1,
                'checkOutDate': 1,
                'addedAt': 1,
                'createdAt': 1,
                'updatedAt': 1,
                'createdAts': {
                    '$toDate': '$createdAt'
                }


            }
        },
        {
            '$project': {
                '_id': 1,
                'orderId': 1,
                'orderDisplayId': 1,
                'userName': 1,
                'userEmail': 1,
                'userMobile': 1,
                'orderNumber': 1,
                'orderStatus': 1,
                'tableDisplayId': 1,
                'tableNumber': 1,
                'tableCategoryId': 1,
                'tableCategoryName': 1,
                'kotstatus': 1,
                'orderItemId': 1,
                'productId': 1,
                'productName': 1,
                'productCode': 1,
                'propertyCategoryId': 1,
                'propertyCategoryName': 1,
                'productAmount': 1,
                'productDescription': 1,
                'productQuantity': 1,
                'taxDetails': 1,
                'totalTax': 1,
                'totalTaxAmount': 1,
                'total': 1,
                'totalAmountWithGst': 1,
                'subTotal': 1,
                'roomId': 1,
                'roomName': 1,
                'roomCategoryId': 1,
                'roomCategoryname': 1,
                'greandTotal': 1,
                'kotid': 1,
                'billNumber': 1,
                'propertyName': 1,
                'propertyId': 1,
                'bookingDisplayId': 1,
                'empId': 1,
                'empName': 1,
                'empEmailID': 1,
                'empType': 1,
                'paymentMode': 1,
                'paymentLogs': 1,
                'propertyinfo': 1,
                'orderType': 1,
                'booking': 1,
                'note': 1,
                'otherAmountTotal': 1,
                'otherAmounts': 1,
                'checkOutDate': 1,
                'addedAt': 1,
                'createdAt': 1,
                'updatedAt': 1,
                'createdAts': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$createdAts',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },

        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                ...(orderType) && { 'orderType': orderType },
                'createdAts': { '$gte': createdAtDate, '$lte': createdAtDate },
                'orderStatus': { $ne: "Cancelled" }
            }
        }

    ]
}




const countTodayOrderDataPipeline = (propertyId, dateFrom, orderType) => {
    const createdAtDate = dateFrom.toString();
    return [{
            '$project': {
                '_id': 1,
                'orderId': 1,
                'orderDisplayId': 1,
                'userName': 1,
                'userEmail': 1,
                'userMobile': 1,
                'orderNumber': 1,
                'orderStatus': 1,
                'tableDisplayId': 1,
                'tableNumber': 1,
                'tableCategoryId': 1,
                'tableCategoryName': 1,
                'kotstatus': 1,
                'orderItemId': 1,
                'productId': 1,
                'productName': 1,
                'productCode': 1,
                'propertyCategoryId': 1,
                'propertyCategoryName': 1,
                'productAmount': 1,
                'productDescription': 1,
                'productQuantity': 1,
                'taxDetails': 1,
                'totalTax': 1,
                'totalTaxAmount': 1,
                'total': 1,
                'totalAmountWithGst': 1,
                'subTotal': 1,
                'roomId': 1,
                'roomName': 1,
                'roomCategoryId': 1,
                'roomCategoryname': 1,
                'greandTotal': 1,
                'kotid': 1,
                'billNumber': 1,
                'propertyName': 1,
                'propertyId': 1,
                'bookingDisplayId': 1,
                'empId': 1,
                'empName': 1,
                'empEmailID': 1,
                'empType': 1,
                'paymentMode': 1,
                'paymentLogs': 1,
                'propertyinfo': 1,
                'orderType': 1,
                'booking': 1,
                'note': 1,
                'otherAmountTotal': 1,
                'otherAmounts': 1,
                'checkOutDate': 1,
                'addedAt': 1,
                'createdAt': 1,
                'updatedAt': 1,
                'createdAts': {
                    '$toDate': '$createdAt'
                }
            }
        },
        {
            '$project': {
                '_id': 1,
                'orderId': 1,
                'orderDisplayId': 1,
                'userName': 1,
                'userEmail': 1,
                'userMobile': 1,
                'orderNumber': 1,
                'orderStatus': 1,
                'tableDisplayId': 1,
                'tableNumber': 1,
                'tableCategoryId': 1,
                'tableCategoryName': 1,
                'kotstatus': 1,
                'orderItemId': 1,
                'productId': 1,
                'productName': 1,
                'productCode': 1,
                'propertyCategoryId': 1,
                'propertyCategoryName': 1,
                'productAmount': 1,
                'productDescription': 1,
                'productQuantity': 1,
                'taxDetails': 1,
                'totalTax': 1,
                'totalTaxAmount': 1,
                'total': 1,
                'totalAmountWithGst': 1,
                'subTotal': 1,
                'roomId': 1,
                'roomName': 1,
                'roomCategoryId': 1,
                'roomCategoryname': 1,
                'greandTotal': 1,
                'kotid': 1,
                'billNumber': 1,
                'propertyName': 1,
                'propertyId': 1,
                'bookingDisplayId': 1,
                'empId': 1,
                'empName': 1,
                'empEmailID': 1,
                'empType': 1,
                'paymentMode': 1,
                'paymentLogs': 1,
                'propertyinfo': 1,
                'orderType': 1,
                'booking': 1,
                'note': 1,
                'otherAmountTotal': 1,
                'otherAmounts': 1,
                'checkOutDate': 1,
                'addedAt': 1,
                'createdAt': 1,
                'updatedAt': 1,
                'createdAts': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$createdAts',
                        'timezone': 'Asia/Kolkata'
                    }
                }
            }
        },
        {
            '$match': {
                'propertyId': Types.ObjectId(propertyId),
                ...(orderType) && { 'orderType': orderType },
                'createdAts': { '$gte': createdAtDate, '$lte': createdAtDate },
                'orderStatus': { $ne: "Cancelled" }
            }
        },
        {
            $count: "totalCount"
        }
    ]
}

module.exports = {
    getcalculationcompleted,
    arrivalReportPipeline,
    arrivalReportTotalPipeline,
    departureReportPipeline,
    departureReportTotalPipeline,
    countarrivalReportPipeline,
    countdepartureReportPipeline,
    nightauditTotalBlockedroomsPipeline,
    nightauditTotalgroupBySourcePipeline,
    nightauditRevenueReportPipeline,
    getdepartureroomCountPileLine,
    getarrivalroomCountPileLine,
    totalcheckinroomfrommonthstarting,
    dailysummeryTotalPaidAmount,
    dailysummeryTotalPaidAmount2,
    totalTaxSummery,
    totalPaymentRecived,
    nightauditcheckOutReportPipeline,

    totalPaymentInfo,
    tableorderdatataxPileLine2,
    tableorderdataPaymentPileLine,
    tableorderdataPaymentPileLineBooking,
    tableorderdatataxPileLine2Booking,
    nightauditTotalroomsPipelineByroomAbilibility,

    todayPaymentsPipeline,
    todayPaymentsbyBookigForPipeLine,
    todayPaymentsgroupbypaymentModePipeLine,
    todayOrderDataPipeline,
    countTodayOrderDataPipeline

}