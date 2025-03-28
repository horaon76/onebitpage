import { Popover } from "@ark-ui/react/popover";

const ShooterGameIntro = () => {
  return (
    <>
      <p>
        Music & Code by :{" "}
        <a href="https://www.linkedin.com/in/harishoraon/" target="_blank">
          Harish Oraon
        </a>
      </p>
      <br />
      <br />
      <p>
        1Bit Shooter is an action-packed arcade-style shooting game where you
        control a fighter jet to take down incoming enemies. Navigate your plane
        using the mouse and shoot down enemies before they reach the bottom.
        Each level brings faster enemies and greater challenges. Keep an eye on
        your lives—once they reach zero, it's game over! Can you survive and set
        the highest score?{" "}
      </p>
      <br />
      <br />
      <div>
        Press Start to begin your mission! 🚀🔥
        <br />
        <Popover.Root>
          <Popover.Trigger>Instructions</Popover.Trigger>
          <Popover.Positioner>
            <Popover.Content>
              <Popover.Description>
                <ul>
                  <li>
                    🎮 <b>Move:</b> Move mouse left/right
                  </li>
                  <li>
                    💥 <b>Shoot:</b> Left click
                  </li>
                  <li>
                    🚀 <b>Power-ups:</b> Collect blue power-ups to increase
                    bullet count (max 5) and then bullet speed
                  </li>
                  <li>
                    🔥 <b>Goal:</b> Shoot all enemies before they reach the
                    bottom!
                  </li>
                </ul>
              </Popover.Description>
            </Popover.Content>
          </Popover.Positioner>
        </Popover.Root>
      </div>
    </>
  );
};


export default ShooterGameIntro;