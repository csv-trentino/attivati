# Use a lightweight Apache + PHP image
FROM php:8.2-apache

# Enable Apache rewrite if needed
RUN a2enmod rewrite

# Copy project files into the web root
COPY . /var/www/html/

# Ensure correct file permissions
RUN chown -R www-data:www-data /var/www/html

# Expose web port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
