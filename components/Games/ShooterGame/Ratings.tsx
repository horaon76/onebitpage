import { RatingGroup } from "@ark-ui/react/rating-group";
import { StarIcon } from "lucide-react";

const Ratings = () => {
  return (
    <RatingGroup.Root count={5} defaultValue={3}>
      <RatingGroup.Label>1Bit-Shooter (Single - Player)</RatingGroup.Label>
      <RatingGroup.Control>
        <RatingGroup.Context>
          {({ items }) =>
            items.map((item) => (
              <RatingGroup.Item key={item} index={item}>
                <RatingGroup.ItemContext>
                  {({ highlighted }) =>
                    highlighted ? <StarIcon fill="current" /> : <StarIcon />
                  }
                </RatingGroup.ItemContext>
              </RatingGroup.Item>
            ))
          }
        </RatingGroup.Context>
        <RatingGroup.HiddenInput />
      </RatingGroup.Control>
    </RatingGroup.Root>
  );
};

export default Ratings;