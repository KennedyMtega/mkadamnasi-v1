import 'package:dio/dio.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic data;

  const ApiException({
    required this.message,
    this.statusCode,
    this.data,
  });

  factory ApiException.fromDioException(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
        return const ApiException(
          message: 'Connection timeout. Please check your internet connection.',
          statusCode: 408,
        );
      case DioExceptionType.sendTimeout:
        return const ApiException(
          message: 'Send timeout. Please try again.',
          statusCode: 408,
        );
      case DioExceptionType.receiveTimeout:
        return const ApiException(
          message: 'Server is taking too long to respond. Please try again.',
          statusCode: 408,
        );
      case DioExceptionType.badResponse:
        return ApiException._fromResponse(error.response);
      case DioExceptionType.cancel:
        return const ApiException(
          message: 'Request was cancelled.',
        );
      case DioExceptionType.connectionError:
        return const ApiException(
          message: 'No internet connection. Please check your network.',
        );
      default:
        return const ApiException(
          message: 'An unexpected error occurred. Please try again.',
        );
    }
  }

  factory ApiException._fromResponse(Response? response) {
    final statusCode = response?.statusCode;
    final data = response?.data;

    String message;
    if (data is Map<String, dynamic> && data.containsKey('message')) {
      message = data['message'] as String;
    } else {
      switch (statusCode) {
        case 400:
          message = 'Bad request. Please check your input.';
          break;
        case 401:
          message = 'Unauthorized. Please log in again.';
          break;
        case 403:
          message = 'You do not have permission to perform this action.';
          break;
        case 404:
          message = 'Resource not found.';
          break;
        case 409:
          message = 'Conflict. This action has already been performed.';
          break;
        case 422:
          message = 'Validation error. Please check your input.';
          break;
        case 429:
          message = 'Too many requests. Please slow down.';
          break;
        case 500:
          message = 'Server error. Please try again later.';
          break;
        default:
          message = 'Something went wrong. Please try again.';
      }
    }

    return ApiException(
      message: message,
      statusCode: statusCode,
      data: data,
    );
  }

  bool get isUnauthorized => statusCode == 401;
  bool get isForbidden => statusCode == 403;
  bool get isNotFound => statusCode == 404;
  bool get isServerError => statusCode != null && statusCode! >= 500;
  bool get isNetworkError => statusCode == null || statusCode == 408;

  @override
  String toString() => 'ApiException($statusCode): $message';
}

class NetworkException extends ApiException {
  const NetworkException()
      : super(
          message: 'No internet connection. Please check your network.',
        );
}

class UnauthorizedException extends ApiException {
  const UnauthorizedException()
      : super(
          message: 'Session expired. Please log in again.',
          statusCode: 401,
        );
}

class ValidationException extends ApiException {
  final Map<String, List<String>>? errors;

  const ValidationException({
    required super.message,
    this.errors,
  }) : super(statusCode: 422);
}
