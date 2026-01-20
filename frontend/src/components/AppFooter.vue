<script setup>
import { ref } from 'vue';

const email = ref('');

const onSubscribe = () => {
    // Placeholder for subscription logic
    email.value = '';
    alert('Thank you for subscribing!');
};
</script>

<template>
  <footer class="app-footer pt-5">
    <div class="container">
      <div class="row g-4 justify-content-between">
        <!-- Column 1: Brand & Intro -->
        <div class="col-lg-4 col-md-6">
          <div class="brand d-flex align-items-center mb-3">
            <img src="@/assets/imgs/universe.png" alt="CineVerse Logo" class="footer-logo me-2">
            <h3 class="mb-0 fw-bold text-white tracking-wide">CineVerse</h3>
          </div>
          <p class="text-muted pe-lg-4">
            Discover the cinematic universe at your fingertips. A place to connect movie lovers, share emotions, and stay updated with the latest blockbusters.
          </p>
          <div class="social-links mt-4">
            <a href="#" class="social-btn" aria-label="Facebook">
              <i class="fab fa-facebook-f"></i>
            </a>
            <a href="#" class="social-btn" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-btn" aria-label="Instagram">
              <i class="fab fa-instagram"></i>
            </a>
            <a href="#" class="social-btn" aria-label="Youtube">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        <!-- Column 2: Discover -->
        <div class="col-lg-2 col-6">
          <h5 class="footer-title mb-3">Discover</h5>
          <ul class="list-unstyled footer-links">
            <li><router-link to="/movies">New Movies</router-link></li>
            <li><router-link to="/trending">Trending</router-link></li>
            <li><router-link to="/tv-shows">TV Shows</router-link></li>
            <li><router-link to="/collections">Collections</router-link></li>
          </ul>
        </div>

        <!-- Column 3: Support & Policy -->
        <div class="col-lg-2 col-6">
          <h5 class="footer-title mb-3">Support</h5>
          <ul class="list-unstyled footer-links">
            <li><router-link to="/help">Help Center</router-link></li>
            <li><router-link to="/contact">Contact Us</router-link></li>
            <li><router-link to="/privacy">Privacy Policy</router-link></li>
            <li><router-link to="/terms">Terms of Service</router-link></li>
          </ul>
        </div>

        <!-- Column 4: Newsletter -->
        <div class="col-lg-3 col-md-6">
          <h5 class="footer-title mb-3">Newsletter</h5>
          <p class="text-muted small mb-3">
            Subscribe to get notified about the hottest movies every week.
          </p>
          <form @submit.prevent="onSubscribe" class="newsletter-form position-relative">
            <input type="email" class="form-control rounded-pill pe-5" placeholder="Your email..." v-model="email"
              required />
            <button type="submit" class="btn btn-primary rounded-circle position-absolute top-0 end-0 m-1 btn-send">
              <i class="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>

      <!-- Divider -->
      <hr class="footer-divider my-5" />

      <!-- Footer Bottom -->
      <div class="footer-bottom pb-4 text-center text-md-start d-flex flex-column flex-md-row justify-content-between align-items-center">
        <p class="text-muted mb-2 mb-md-0 small">
          &copy; {{ new Date().getFullYear() }} <span class="text-white">CineVerse</span>. All rights reserved.
        </p>
        <p class="text-muted mb-0 small">
          Designed with <i class="fas fa-heart text-danger"></i> by <span class="text-white">DevTeam</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: #0b0d17; /* Deep dark background */
  background-image: linear-gradient(180deg, rgba(11, 13, 23, 0.8) 0%, #0b0d17 100%);
  color: var(--text-color-dark);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 10;
  margin-top: auto;
}

.footer-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.tracking-wide {
  letter-spacing: 0.5px;
}

/* Titles */
.footer-title {
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
}

/* Links List */
.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: #a0a3bd;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.footer-links a:hover {
  color: var(--accent-color, #7000ff);
  padding-left: 5px;
}

/* Social Buttons */
.social-btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  color: #fff;
  margin-right: 10px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-btn:hover {
  background: var(--accent-color, #7000ff);
  transform: translateY(-3px);
  color: #fff;
}

/* Newsletter Input */
.newsletter-form .form-control {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding-left: 1.25rem;
}

.newsletter-form .form-control:focus {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--accent-color, #7000ff);
  box-shadow: none;
}

.newsletter-form .btn-send {
  width: 38px;
  height: 38px;
  background-color: var(--accent-color, #7000ff);
  border: none;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;
}
.newsletter-form .btn-send:hover {
   background-color: #5a00cc;
}


/* Divider */
.footer-divider {
  border-color: rgba(255, 255, 255, 0.05);
}

/* Text Muted Custom */
.text-muted {
  color: #a0a3bd !important;
}
</style>