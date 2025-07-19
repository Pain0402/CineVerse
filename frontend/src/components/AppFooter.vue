<template>
  <footer class="text-center py-4">
    <div class="container">
      <div class="">
        <img src="@/assets/imgs/universe.png" alt="CineVerse Logo" class="mb-2" style="width: 50px; height: 50px;">
        <h2 class="text-white">CineVerse</h2>
        <p>Your gateway to the universe of cinema.</p>
        <div>
          <h2 class="text-white">Follow Us</h2>
          <div class="social d-icons d-flex justify-content-space-evenly  mb-3">
            <a href="https://www.facebook.com/cineverse" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-facebook-square fa-2x text-white"></i>
            </a>
            <a href="https://www.twitter.com/cineverse" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-twitter-square fa-2x text-white"></i>
            </a>
            <a href="https://www.instagram.com/cineverse" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-instagram-square fa-2x text-white"></i>
            </a>
            <a href="https://www.youtube.com/cineverse" target="_blank" rel="noopener noreferrer">
              <i class="fab fa-youtube-square fa-2x text-white"></i>
            </a>
          </div>
        </div>
      </div>
      <p>&copy; 2024 CineVerse. All rights reserved.</p>
    </div>
  </footer>
</template>

<style>
.social {
  display: flex;
  justify-content: center;
  gap: 20px;
}

footer {
  border-top: 1px solid var(--border-glass);
  color: rgba(255, 255, 255, 0.5);
  background-color: var(--deep-space-black);
  width: 100%;
}
</style>